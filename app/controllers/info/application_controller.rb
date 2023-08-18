class Info::ApplicationController < ActionController::Base

  include Passwordless::ControllerHelpers
  helper_method :current_user
  before_action :set_locale!

  def index
  end

  def about
  end

  def privacy
    render "info/privacy/privacy.#{I18n.locale}"
  end

  def statistics
    @events_data = Country.joins(:events).select('countries.country_code, count(events.id) as count').group('countries.country_code, countries.name').map { |c| [ c.country_code, c.count ] }.to_h

    recent_month_names = 5.downto(1).collect do |n| 
      Date.parse(Date::MONTHNAMES[n.months.ago.month]).strftime('%b')
    end
    
    monthly_registrations = Registration.since(6.months.ago).group_by_month.count.map { |k, v| [k.strftime("%b"), v] }.to_h
    @registrations_data = {
      labels: recent_month_names,
      series: [
        {
          name: 'monthly',
          data: recent_month_names.map { |m| monthly_registrations[m] || 0 },
        }
      ],
    }
  end

  private

    def current_user
      @current_user ||= authenticate_by_session(Manager)
    end

    def set_locale!
      I18n.locale = params[:locale]&.to_sym || :en
    end

end
