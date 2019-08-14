import { Application } from './application';

describe('Application', () => {
    let app: Application;
    beforeEach(() => {
        app = Application.create();
    });

    describe('::create', () => {
        it('returns a new instance of the Application', () => {
            expect(app).toBeDefined();
            expect(app).toBeInstanceOf(Application);
        });
    });
});
