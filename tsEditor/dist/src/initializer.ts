import * as $ from "jquery";
import { App } from "./app";
import { Handlers } from "./eventHandlers";

interface StyleControl {
    style: string;
    control: string
}

interface Section {
    name: string;
    styles?: string[];
    cstyles?: StyleControl[]
}

interface SectionName {
    section: string;
    content: string;
}

var sections: Section[] = [
    {name:'Dimensions', styles: ['width', 'height', 'max-width', 'max-height']},
    {name:'Margins', styles: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left']},
    {name:'Padding', styles: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']},
    {name:'Font', styles: ['font-family', 'font-size', 'font-weight', 'font-style']},
    {name:'Border', styles: ['border-style', 'border-width', 'border-color', 'border-radius']},
    {name:'Flags', cstyles: [{style:'readonly', control:'checkbox'}]}
];

var tagSections: {tag: string, sections: string[]}[] = [
{tag: 'input', sections: ['Margins', 'Padding', 'Flags']},
{tag: 'p', sections: ['Dimensions', 'Margins', 'Padding', 'Font', 'Border']},
{tag: 'div', sections: ['Dimensions', 'Margins', 'Padding', 'Border']},
{tag: 'ul', sections: ['Margins', 'Padding', 'Border']},
{tag: 'li', sections: ['Margins', 'Padding', 'Border']},
{tag: 'a', sections: []},
{tag: 'h1', sections: ['Margins', 'Padding', 'Border']},
{tag: 'h2', sections: ['Margins', 'Padding', 'Border']},
{tag: 'h3', sections: ['Margins', 'Padding', 'Border']},
{tag: 'h4', sections: ['Margins', 'Padding', 'Border']},
{tag: 'h5', sections: ['Margins', 'Padding', 'Border']},
];

// No particular need here for a namespace (used to be called module) or class here.
// The methods are wrapped in a "namespace" on import.
export function initializeEditor() {
    console.log("Foo");
    debugger;
    initializeSections();
    setupButtonBar();
    setupSourcePropertiesContainer();
    wireUpEvents();
}

function setupButtonBar() {
    let html = $('#__sourceButtonBar').html();
    $('.__buttonBar').html(html);
}

function initializeSections() {
    sections.forEach(s => {
        let i = 0;

        // If we have simple string styles, then create the "complex" cstyle objects.
        if (s.styles) {
            // Support mixing the two together.
            if (!s.cstyles) {
                s.cstyles = [];
            }

            for (i = 0; i < s.styles.length; i++) {
                let asComplexStyle = {style: s.styles[i], control: 'input'};
                s.cstyles.push(asComplexStyle);
            }
        }
    });

    console.log(sections);
}

function setupSourcePropertiesContainer() {
    let sectionNames = sections.map(s => s.name);

    let sectionTemplate = $('#__sectionTemplate').html();
    let sectionContent: string[] = [];
    let sectionNameClasses: SectionName[] = [];
    
    sectionNames.forEach(n =>
    {
        let sectionName = '__sectionName' + n;
        let contentName = '__content' + n;
        let st = sectionTemplate.replaceAll('{sectionName}', n);
        st = st + "<div class='" + contentName + "'>";
        st = createSectionStyleTemplate(sections.filter(s => s.name == n)[0].cstyles, st);
        st = st + "</div>";
        sectionContent.push(st);
        sectionNameClasses.push({section: '.' + sectionName, content: '.' + contentName});

        // All section content initially visible
        App.sectionContentVisible['.' + contentName] = true;
    });

    // LocalStore.put('sectionContentVisible', 1);

    $("#__sections").html(sectionContent.join(''));

    wireUpSectionEvents(sectionNameClasses);
    wireUpSectionStyleEvents(sections);
}

function createSectionStyleTemplate(styles: StyleControl[], template: string) {
    styles.forEach(s =>
    {
        let overrideTemplate = $('#__' + s.control + 'StyleTemplate').html();
        template = template + overrideTemplate.replaceAll('{name}', s.style);
    });

    return template;
}

function wireUpSectionEvents(sectionNameClasses:  SectionName[]) {

    sectionNameClasses.forEach(sni =>
    {
        // When clicking on the section div, show or hide the content.
        // This doesn't work:
        // $(sni.section).on('click', () => showOrHideContent(sni.content));
        // We have to wire this up at the document level and pass in the selector!
        // See: https://stackoverflow.com/a/29674985/2276361
        $(document).on('click', sni.section, () => App.showOrHideSectionContent(sni.content));
    })
}

function wireUpSectionStyleEvents(sections: Section[]) {
    // Also wire up future property style input boxes and checkbox events.
    sections.forEach(section =>
    {
        section.cstyles.filter(s=>s.control=='input').forEach(sectStyle =>
        {
            let inputElement = '#__inputProperty' + sectStyle.style;
            
            $(document).on('keydown', inputElement + 'h', Handlers.onInputKeyPress);
            $(document).on('blur', inputElement + 'h', Handlers.onUpdateElementStyle);

            $(document).on('keydown', inputElement + 'v', Handlers.onInputKeyPress);
            $(document).on('blur', inputElement + 'v', Handlers.onUpdateElementStyle);
        });

        section.cstyles.filter(s=>s.control=='checkbox').forEach(sectStyle =>
        {
            let inputElement = '#__inputProperty' + sectStyle.style;
            $(document).on('click', inputElement + 'h', Handlers.onCheckbox);
            $(document).on('click', inputElement + 'v', Handlers.onCheckbox);
        });
    });
}

function wireUpEvents() {
    $('.__showHorizontal').click(() => Handlers.showHorizontalLayout());
    $('.__showVertical').click(() => Handlers.showVerticalLayout());
    $('.__clearEditors').click(() => Handlers.clearEditors());
    $('.__save').click(() => Handlers.save());
    $('.__toc').click(() => Handlers.generateTOC());
}
