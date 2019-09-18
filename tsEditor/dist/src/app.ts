export abstract class App {
    static altKeyDown: boolean = false;
    static ctrlKeyDown: boolean = false;
    static hoverElement: boolean = undefined;
    static selectedElement: Element = undefined;
    static currentEditor: string = '#__editorv';
    static currentPreview: string = '#__previewv';
    static sectionContentVisible: {[key: string]: boolean} = {};     

    static showOrHideSectionContent(id: string) {
        if ($(id).hasClass('__hidden')) {
            $(id).removeClass('__hidden');
            App.sectionContentVisible[id] = true;
        } else {
            $(id).addClass('__hidden');
            App.sectionContentVisible[id] = false;
        }
    }

    static updateSource() {
        let editor = $(App.currentEditor);
        let preview = $(App.currentPreview);
        let text = preview.html();
        editor.val(text);
    }

    static updateElementStyle(event: any) {
        let elName = '#' + event.target.id;
        let el = $(elName);
        let attr = $(el).attr('cssName');
        let val: any = el.val();
        $(App.selectedElement).css(attr, val);       
        App.updateSource();
        App.updateOtherPropertyGrid(elName, val);
    }
    
    static updateOtherPropertyGrid(elName: string, val: any) {
        // We also need to update the complimentary input in the other properties section
        // Remove the trailing h or v.
        let hv = elName[elName.length - 1];
        let althv = hv == 'h' ? 'v' : 'h';
        let elx = elName.slice(0, -1) + althv;
        $(elx).val(val);
    }

    // Copy from one editor to the other
    static copy(esource: string, etarget: string) {
        let edSource = '#__editor' + esource;
        let edTarget = '#__editor' + etarget;
        let pTarget = '#__preview' + etarget;

        if (App.selectedElement) {
            // Retain the current selection by marking it with a special attribute and then resetting it to that element after updating the HTML.
            $(App.selectedElement).attr('__hv__', 42);
            App.updateSource();
        }

        let editorText = <string>$(edSource).val();
        $(edTarget).val(editorText);
        $(pTarget).html(editorText);

        if (App.selectedElement)
        {
            // Then remove the element.  Note that it exists in two places now, the source HTML and the target HTML.
            // selectedElement is still pointing to the source element.
            $(App.selectedElement).removeAttr('__hv__');

            // Find the same element in the target HTML.  This is now the new selected element.
            App.selectedElement = $("[__hv__ = '42']")[0];

            // And remove all occurrances, to be safe.
            $("[__hv__ = '42']").removeAttr('__hv__');
        }
    }


    // https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
    static download(filename: string, text: string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

}