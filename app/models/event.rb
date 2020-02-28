class Event < ApplicationRecord

  # Extensions
  include Manageable
  include Publishable
  include Expirable

  nilify_blanks
  searchable_columns %w[name description]
  audited

  # Associations
  belongs_to :venue
  acts_as_mappable through: :venue

  has_many :pictures, as: :parent, dependent: :destroy
  accepts_nested_attributes_for :pictures

  has_many :registrations, dependent: :delete_all

  enum category: { intro: 1, intermediate: 2, course: 3, public_event: 4, concert: 5 }
  enum recurrence: { day: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 }
  enum registration_mode: { native: 0, meetup: 1, eventbrite: 2 }, _suffix: true

  # Validations
  validates :name, length: { maximum: 255 }
  validates :category, presence: true
  validates :language, presence: true
  validates :start_date, presence: true
  validates :start_time, presence: true
  validates :recurrence, presence: true
  validates :description, length: { minimum: 20, maximum: 600, allow_nil: true }
  validates_associated :pictures

  # Scopes
  scope :with_new_registrations, -> { where('latest_registration_at >= registrations_sent_at') }
  scope :notifications_enabled, -> { where.not(disable_notifications: true) }

  # Delegations
  delegate :full_address, to: :venue
  alias parent venue

  # Methods

  def managed_by? manager, super_manager: false
    return true if !super_manager && managers.include?(manager)

    venue.managed_by?(manager)
  end

  def language= value
    # Only accept languages which are in the language list
    super value if I18nData.languages.key?(value)
  end

end
