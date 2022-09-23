module HasClient

  extend ActiveSupport::Concern

  included do
    has_one :client, as: :location
  end

  def client_bounds
    [[bounds[2], bounds[0]], [bounds[3], bounds[1]]] if respond_to?(:bounds)
  end

  def canonical_domain
    client&.domain || parent&.canonical_domain
  end

  def canonical_map_url
    client&.url || parent&.canonical_map_url
  end

end
