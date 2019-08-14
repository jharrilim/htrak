import { Application } from './application';

export function main() {
    Application
        .create()
        .start(8080, '0.0.0.0')
        .then(() => console.log('Application started on http://0.0.0.0:8080/'));
}

if (process.mainModule!.filename === __filename) {
    main();
}
