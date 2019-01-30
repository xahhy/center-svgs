import './index.less';
const generateCenterViewBox = (svg, padding = 0) => {
  const {
    x,
    y,
    width,
    height
  } = svg.getBBox();
  const edge = Math.max(width, height) + padding + padding;
  let [
    newX,
    newY
  ] = [
    x,
    y
  ];
  if (width > height) {
    newY = y - (width - height) / 2;
  } else {
    newX = x - (height - width) / 2;
  }
  return {
    x: newX - padding,
    y: newY - padding,
    width: edge,
    height: edge
  };
};

const createDownloadLink = (id, content) => {
  const downloadLink = document.getElementById(id);
  var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(content);
  downloadLink.href = url;
  downloadLink.download = id + '.svg';
};

window.onload = () => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
  const fileElement = document.getElementById('file');
  fileElement.addEventListener('change', event => {
    const files = event.target.files;
    event.value = '';
    console.log(files);
    Array.from(files).forEach(file => {
      console.log(file.type);
      if (file.type.match('svg')) {

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
          return e => {
            // Render thumbnail.
            var a = document.createElement('a');
            a.id = theFile.name.split('.').slice(0, -1).join('.');
            a.innerHTML = [e.target.result].join('');
            document.getElementById('list').insertBefore(a, null);
          };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsText(file);
      }
    });
  });

  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', event => {
    const svgList = document.querySelectorAll('#list a svg');
    svgList.forEach(svg => {
      const padding = Number(document.getElementById('padding').value);
      const newViewBox = generateCenterViewBox(svg, padding);
      const {
        x,
        y,
        width,
        height
      } = newViewBox;
      console.log(newViewBox);
      svg.setAttribute('viewBox', [x, y, width, height].join(' '));
      createDownloadLink(svg.parentElement.id, svg.outerHTML);
    });
  });

  const downloadAll = document.getElementById('downloadAll');
  downloadAll.addEventListener('click', () => {
    document.querySelectorAll('#list a').forEach(link => link.click());
  });
};