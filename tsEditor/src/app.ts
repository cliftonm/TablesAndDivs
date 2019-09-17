export abstract class App {
    static altKeyDown: boolean = false;
    static ctrlKeyDown: boolean = false;
    static hoverElement: boolean = undefined;
    static selectedElement: string = undefined;
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
}