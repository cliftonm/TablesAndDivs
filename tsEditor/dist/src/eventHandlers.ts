import { App } from "./app";

export abstract class Handlers {
    static onCheckbox(event: any) {
        let elName = '#' + event.currentTarget.id;
        let el = $(elName);
        let attr = $(el).attr('cssName');
        let checked = el.is(':checked');
        $(App.selectedElement).prop(attr, checked);       
        App.updateSource();

        // like updateOtherPropertyGrid
        let hv = elName[elName.length - 1];
        let althv = hv == 'h' ? 'v' : 'h';
        let elx = elName.slice(0, -1) + althv;
        $(elx).prop('checked', checked);       
    }

    static onInputKeyPress(event: any) {
        if (event.keyCode == 13) {
            App.updateElementStyle(event);
        }
    }

    static onUpdateElementStyle(event: any) {
        App.updateElementStyle(event);
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

    static showVerticalLayout() {
        App.copy('h', 'v');
        $('#__verticalView').removeClass('__hidden');
        $('#__horizontalView').addClass('__hidden');
        App.currentEditor = '#__editorv';
        App.currentPreview = '#__previewv';
    }
    
    static showHorizontalLayout() {
        App.copy('v', 'h');
        $('#__verticalView').addClass('__hidden');
        $('#__horizontalView').removeClass('__hidden');
        App.currentEditor = '#__editorh';
        App.currentPreview = '#__previewh';
    }
    
    static clearEditors() {
        $('#__editorh').val('');
        $('#__editorv').val('');
        $('#__previewh').html('');
        $('#__previewv').html('');
    }
    
    static save() {
        let editor = $(App.currentEditor);
        let text = <string>editor.val();
        App.download('content.html', text);
    }

    static generateTOC() {
        let foo = 1;
        console.log(foo);
        debugger;
    }
}
