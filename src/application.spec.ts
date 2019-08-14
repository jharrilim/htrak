import { Application } from './application';

describe('Application', () => {
    describe('::create', () => {
        it('returns a new instance of the Application', () => {
            const app = Application.create();
            expect(app).toBeDefined();
            expect(app).toBeInstanceOf(Application);
        });
    })
});
