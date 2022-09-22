/* exported ShareModal */
/* global m, Util */

function ShareModal() {
  const SHARING_URLS = {
    mail: 'mailto:?subject={title}&body={url}',
    facebook: 'https://www.facebook.com/sharer.php?u={url}',
    twitter: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    linkedin: 'https://www.linkedin.com/shareArticle?url={url}&title={title}&summary={text}&source={provider}',
    flipboard: 'https://share.flipboard.com/bookmarklet/popout?v=2&title={title}&url={url}',
  }

  // TODO: Implement object sharing
  function formatUrl(template, url) {
    template = template.replace('{url}', encodeURIComponent(url))
    //template = template.replace('{title}', encodeURIComponent(event.label))
    //template = template.replace('{text}', encodeURIComponent(event.description))
    template = template.replace('{provider}', encodeURIComponent(window.location.hostname))
    return template
  }

  function copyLink(event) {
    event.currentTarget.select()
    document.execCommand('copy')
  }

  function nativeShare(url) {
    return new Promise(async (resolve) => {
      await navigator.share({
        //title: event.label,
        //text: event.description,
        url: url,
      })
  
      resolve()
    })
  }

  return {
    onbeforeremove: function(vnode) {
      vnode.dom.classList.add('fadeout')
      return new Promise(function(resolve) {
        vnode.dom.addEventListener('animationend', resolve)
      })
    },
    view: function() {
      const backPath = m.route.get().split('?')[0]
      const shareUrl = window.location.href.split('?')[0]

      // TODO: Implement native share
      /*
      if (navigator && navigator.share) {
        nativeShare(shareUrl)
        return null
      }
      */

      return m('.sya-share-background',
        m('.sya-share',
          m('.sya-share__header', Util.translate('sharing.header')),
          m(m.route.Link, {
            class: 'sya-share__close',
            href: backPath,
          }, m('.sya-icon.icon--close')),
          m('.sya-share__link',
            m('.sya-icon.icon--link'),
            m('input', {
              type: 'text',
              value: shareUrl,
              onclick: copyLink,
              onfocus: copyLink,
            }),
            m('.sya-share__link__confirmation', Util.translate('sharing.copied')),
          ),
          m('.sya-share__social',
            Object.entries(SHARING_URLS).map(function([key, template]) {
              return m(`a.share__${key}`, {
                href: formatUrl(template, shareUrl),
                target: '_blank',
              }, m('.sya-icon', { class: `sya-icon--${key}` }))
            })
          )
        )
      )
    }
  }
}