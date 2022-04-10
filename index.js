window.$docsify.markdown = {
  renderer: {
      // 自定义函数，从 hash 中获取相对路径
      relativePath: function () {
          // 从 hash 获取需要加上的路径
          let relative = location.hash;
          if (relative.startsWith('#')) {
              relative = relative.substr(1);
          }
          idx = relative.lastIndexOf('/');
          if (idx != -1) {
              relative = relative.substr(0, idx + 1)
          }
          if (relative.startsWith('/')) {
              relative = relative.substr(1);
          }
          return './' + relative;
      },
      // 解决非markdown链接路径问题
      link: function (href) {
          // 用绝对路径，否则默认处理后有问题
          if (!href.endsWith(".md") && !href.startsWith('http://') && !href.startsWith('https://')) {
              if (href.startsWith('/')) {
                  href = href.substr(1);
                  href = location.origin + location.pathname + href;
              } else {
                  href = location.origin + location.pathname + this.relativePath() + href;
              }
          }
          return this.origin.link.apply(this, arguments);
      },
      // 处理 img 标签路径问题
      html: function (html) {
          // 处理 hash 情况下 html 中 img 相对路径
          let domParser = new DOMParser();
          dom = domParser.parseFromString("<html><body>" + html + "</body></html>", 'text/html');
          let imgs = dom.querySelectorAll('img');
          if (!imgs.length) {
              console.log(html)
              return html;
          }
          imgs.forEach(img => {
              let src = img.getAttribute('src');
              // 绝对路径不处理
              if (src.startsWith('http://') ||
                  src.startsWith('https://') ||
                  src.startsWith('/')) {
                  return;
              }
              // 从 hash 获取需要加上的路径
              let relative = this.relativePath();
              img.setAttribute('src', relative + src);
          });
          return dom.querySelector('body').innerHTML;
      }
  }
}