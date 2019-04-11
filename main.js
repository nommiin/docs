function CreateTab(url) {
    let File = new $gmedit["gml.file.GmlFile"]("Documentation", null, $gmedit["file.kind.gml.KGmlSearchResults"].inst, url), close = File.__proto__.close;
    File.doc = {
        view: document.createElement("webview"),
        url: url
    };
    File.doc.view.style.width = "100%";
    File.doc.view.style.height = "100%";
    File.doc.view.style.display = "";
    File.doc.view.src = url;
    document.getElementsByClassName("bottom gml")[0].after(File.doc.view);
    document.getElementsByClassName("bottom gml")[0].style.display = "none";
    $gmedit["gml.file.GmlFile"].openTab(File);
}

(function() {
    GMEdit.register("docs", {
        init: function() {
            // Hook into openExternal function
            let openExternal = Electron_Shell.openExternal;
            Electron_Shell.openExternal = function() {
                if (arguments[0].includes("docs2.yoyogames.com") == true) {
                    CreateTab(arguments[0]);
                } else {
                    return openExternal.apply(this, arguments);
                }
            }

            // Hook into set_current function
            let set_current = $gmedit["gml.file.GmlFile"].set_current;
            $gmedit["gml.file.GmlFile"].set_current = function() {
                document.querySelectorAll(".chrome-tab").forEach((e) => {
                    if (e.gmlFile.doc != undefined) {
                        e.gmlFile.doc.view.style.display = "none";
                    }
                });

                if (arguments[0].doc != undefined) {    
                    arguments[0].doc.view.style.display = "";
                    document.getElementsByClassName("bottom gml")[0].style.display = "none";
                } else {
                    document.getElementsByClassName("bottom gml")[0].style.display = "";
                }
                return set_current.apply(this, arguments);
            }

            // Hook into tab close function
            let close = $gmedit["gml.file.GmlFile"].prototype.close;
            $gmedit["gml.file.GmlFile"].prototype.close = function() {
                if (this.doc != undefined) {
                    this.doc.view.remove();
                    delete this.doc;
                }
                return close.apply(this, arguments);
            }
        }
    });
})();