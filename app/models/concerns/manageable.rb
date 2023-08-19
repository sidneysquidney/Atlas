module Manageable

  extend ActiveSupport::Concern

  included do
    has_many :managed_records, as: :record, dependent: :delete_all
    has_many :managers, through: :managed_records, dependent: :destroy
  end

  def managed_by? manager, super_manager: nil
    return true if managers.include?(manager) && super_manager != true
    return true if respond_to?(:parent) && parent.respond_to?(:managed_by?) && parent.managed_by?(manager) && super_manager != false

    false
  end

  def parent_managers
    @parent_managers ||= (respond_to?(:parent) && parent.present? ? parent.all_managers : [])
  end

  def all_managers except: []
    @all_managers ||= begin
      result = managers.where.not(id: except).to_a
      excluded_ids = result.map(&:id)
      result += parent.all_managers(except: except + excluded_ids) if respond_to?(:parent) && parent.present?
      result
    end
  end

end
