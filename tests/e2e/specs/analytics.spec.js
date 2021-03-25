import { base } from '../../../src/.vuepress/config';

describe('Analytics', () => {
    it('has GA code present', () => {
        cy.visit(base);
        cy.window().then((win) => {
            // Google Tag Manager has been loaded.
            expect(win.google_tag_data).to.be.an('object');
            expect(win.google_tag_manager).to.be.an('object');
            expect(win.gtag).to.be.a('function');
        });
    });
});
