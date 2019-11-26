/* global AtlasAPI, WorldMap, SearchBox, ListingPanel, InformationPanel, RegistrationPanel, SharingPanel */
/* exported Applicatio */

class ApplicationInstance {

  constructor() {
    const map = document.getElementById('map')
    const initialLocation = JSON.parse(map.dataset.location)

    this.map = new WorldMap(map)
    this.panels = {}
    this.panels.listing = new ListingPanel(document.getElementById('js-listing-panel'))
    this.panels.information = new InformationPanel(document.getElementById('js-information-panel'))
    this.panels.registration = new RegistrationPanel(document.getElementById('js-registration-panel'))
    this.panels.sharing = new SharingPanel(document.getElementById('js-sharing-panel'))
    this.search = new SearchBox(document.getElementById('js-search'))
    this.atlas = new AtlasAPI()
    this.activePanel = { key: 'listing', event: null, panel: this.panels.listing }
    this.panelHistory = new Map()
    this.loadEvents(initialLocation)
    
    const collapseButtons = document.querySelectorAll('.js-collapse')
    for (let i = 0; i < collapseButtons.length; i++) {
      collapseButtons[i].addEventListener('click', () => this.toggleCollapsed())
    }
    
    const backButtons = document.querySelectorAll('.js-back')
    for (let i = 0; i < backButtons.length; i++) {
      backButtons[i].addEventListener('click', () => this.showPreviousPanel())
    }
  }

  toggleCollapsed(collapsed) {
    document.body.classList.toggle('collapsed', collapsed)
    this.map.leaflet.invalidateSize()
  }

  showPanel(panelKey, event = null) {
    if (this.activePanel) {
      this.pushPanelHistory(this.activePanel)
      this.activePanel.panel.hide()
    }

    if (panelKey) {
      this.activePanel = {
        key: panelKey,
        event: event,
        panel: this.panels[panelKey],
      }

      if (panelKey == 'listing') {
        this.panelHistory.clear()
      } else {
        this.panelHistory.delete(panelKey)
      }

      if (event) {
        this.activePanel.panel.show(event)
        this.panels.listing.setActiveItem(event ? event.id : null)
        this.map.zoomToVenue(event)
      } else {
        this.activePanel.panel.show(event)
      }
    } else {
      this.activePanel = null
    }
  }

  showPreviousPanel() {
    if (this.activePanel) {
      this.activePanel.panel.hide()
      this.activePanel = this.popPanelHistory()
    }

    if (this.activePanel) {
      const event = this.activePanel.event
      if (event) {
        this.activePanel.panel.show(event)
        this.panels.listing.setActiveItem(event.id)
        this.map.zoomToVenue(event)
      } else {
        this.activePanel.panel.show()
        this.map.fitToMarkers()
      }
    }
  }

  pushPanelHistory(panelData) {
    this.panelHistory.delete(panelData.key)
    this.panelHistory.set(panelData.key, panelData)
  }

  popPanelHistory() {
    if (this.panelHistory.size > 0) {
      let entry = null
      for (entry of this.panelHistory);
      this.panelHistory.delete(entry[0])
      return entry[1]
    } else {
      return null
    }
  }

  loadEvents(query) {
    this.showPanel('listing')
    this.atlas.query(query, events => {
      this.map.setEventMarkers(events)
      this.panels.listing.setEvents(events)
      this.toggleCollapsed(false)
    })
  }

}

document.addEventListener('DOMContentLoaded', () => {
  window.Application = new ApplicationInstance()
})