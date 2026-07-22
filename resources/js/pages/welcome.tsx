import { Head } from '@inertiajs/react';
import BookItApp from '../bookit/App';

export default function Welcome() {
    return (
        <>
            <Head title="BookIt Workspace Engine" />
            <BookItApp />
        </>
    );
}
