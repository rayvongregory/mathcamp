tinymce.init({
  selector: "#mytextarea",
  plugins:
    "advlist autolink autosave charmap code emoticons fullscreen hr image imagetools importcss lists media wordcount",
  external_plugins: {
    tiny_mce_wiris: "https://www.wiris.net/demo/plugins/tiny_mce/plugin.js",
  },
  toolbar:
    "fullscreen | undo redo | tiny_mce_wiris_formulaEditor charmap image media emoticons hr | cut copy | styleselect | fontselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough superscript subscript numlist bullist code | alignleft aligncenter alignright alignjustify lineheight lists | outdent indent ",
  fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt 60pt",
  content_style:
    ".left { text-align: left; } " +
    "img.left { float: left; } " +
    "table.left { float: left; } " +
    ".right { text-align: right; } " +
    "img.right { float: right; } " +
    "table.right { float: right; } " +
    ".center { text-align: center; } " +
    "img.center { display: block; margin: 0 auto; } " +
    "table.center { display: block; margin: 0 auto; } " +
    ".full { text-align: justify; } " +
    "img.full { display: block; margin: 0 auto; } " +
    "table.full { display: block; margin: 0 auto; } " +
    ".bold { font-weight: bolder; } " +
    ".italic { font-style: italic; } " +
    ".underline { text-decoration: underline; } " +
    ".example1 {} " +
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }" +
    ".tablerow1 { background-color: #D3D3D3; }",
  formats: {
    alignleft: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
      classes: "left",
    },
    aligncenter: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
      classes: "center",
    },
    alignright: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
      classes: "right",
    },
    alignfull: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video",
      classes: "full",
    },
    bold: { inline: "span", classes: "bold" },
    italic: { inline: "span", classes: "italic" },
    underline: { inline: "span", classes: "underline", exact: true },
    strikethrough: { inline: "del" },
  },
  menubar: "",

  // toolbar:
  // "addcomment image showcomments checklist code export pageembed table",
  // toolbar_mode: "floating",
  // tinycomments_mode: "embedded",
  // tinycomments_author: "Author name",
})
