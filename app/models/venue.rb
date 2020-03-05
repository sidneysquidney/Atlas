class Venue < ApplicationRecord

  # Extensions
  include Publishable

  audited
  nilify_blanks
  acts_as_mappable lat_column_name: :latitude, lng_column_name: :longitude
  searchable_columns %w[name street city province_code country_code]

  # Associations
  belongs_to :country, foreign_key: :country_code, primary_key: :country_code, optional: true
  belongs_to :province, foreign_key: :province_code, primary_key: :province_code, optional: true
  has_many :events, dependent: :delete_all

  # Validations
  validates :street, presence: true
  validates :country_code, presence: true
  validates :latitude, :longitude, :place_id, presence: true

  # Methods
  delegate :all_managers, :managed_by?, to: :parent

  def parent
    province || country
  end

  def managed_by? manager, super_manager: false
    manager.local_areas.each do |local_area|
      return true if local_area.contains?(venue)
    end

    parent.managed_by?(manager)
  end

  # Check if coordinates have been defined
  def coordinates?
    latitude.present? && longitude.present?
  end

  def coordinates
    [latitude, longitude]
  end

  def country_code= value
    value = value.to_s.upcase
    # Only accept country codes which are in the language list
    super value if I18nData.countries.keys.include?(value)
  end

end
