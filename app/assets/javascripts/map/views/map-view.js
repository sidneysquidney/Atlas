/* exported MapView */

/* global m, Search, Navigation, Util */

function MapView() {
  let onlineEventsCount = null
  let offlineEventsCount = null

  return {
    view: function(vnode) {
      App.data.getList(AtlasEvent.LAYER.online).then(events => {
        onlineEventsCount = events.length
        m.redraw()
      })

      if (App.map) {
        App.map.getRenderedEventIds().then(eventIds => {
          offlineEventsCount = eventIds.length

          if (offlineEventsCount > 0 && !Util.isDevice('mobile')) {
            m.route.set(`/${AtlasEvent.LAYER.offline}`)
          }
        }, _error => {
          offlineEventsCount = null
        }).finally(() => m.redraw())
  
        App.map.addEventListener('movestart', () => {
          offlineEventsCount = null
          m.redraw()
        })
      }

      return [
        m(Search, { floating: true }),
        m(Navigation, {
          items: Object.entries(AtlasEvent.LAYER).map(([key, layer]) => {
            const active = vnode.attrs.layer == layer
            return {
              label: Util.translate(`navigation.desktop.${key}`),
              href: `/${layer}`,
              active: active,
              badge: active ? null : (key == 'online' ? onlineEventsCount : offlineEventsCount),
            }
          })
        }),
      ]
    }
  }
}