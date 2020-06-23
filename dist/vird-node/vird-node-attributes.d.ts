interface VirdTextContentAttributes {
    textContent: string;
}
interface VirdNodeAcceptAttributes {
    accept: string;
}
interface VirdNodeAutoCompleteAttributes {
    autocomplete: 'off' | 'on' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'email' | 'username' | 'new-password' | 'current-password' | 'one-time-code' | 'organization-title' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-extension' | 'impp' | 'url' | 'photo';
}
interface VirdNodeNameAttributes {
    name: string;
}
export interface VirdNodeAttributes extends VirdTextContentAttributes {
    accesskey: string;
    autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    class: string;
    contenteditable: 'true' | 'false' | '';
    dir: 'ltr' | 'rtl' | 'auto';
    draggable: 'true' | 'false';
    dropzone: string;
    hidden: '';
    id: string;
    itemprop: string;
    lang: string;
    slot: string;
    spellcheck: 'true' | 'false';
    style: string;
    tabindex: string;
    title: string;
    translate: 'yes' | 'no' | '';
    [key: string]: string;
}
export interface VirdFormNodeAttributes extends VirdNodeAcceptAttributes, VirdNodeAutoCompleteAttributes, VirdNodeNameAttributes, VirdNodeAttributes {
    'accept-charset': string;
    action: string;
    enctype: string;
    method: string;
    novalidate: string;
}
export {};
