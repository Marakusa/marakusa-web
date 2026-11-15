import { useAuth } from '../context/auth';
import { Spinner } from '../components/Spinner';
import LinkText from '../components/LinkText';

function Licenses() {
    const { user, isLoading } = useAuth();

    return (
        <div className="text-left grow">
            <h1>Licenses</h1>
            {isLoading && <Spinner />}
            {!isLoading && (
                !user ? (
                    <p>Seems like you are not logged in. Please <LinkText href="/api/auth/login">log in</LinkText> to view your licenses.</p>
                ) : (
                    <p>Here you can find information about your licenses.</p>
                )
            )}
        </div>
    );
}

export default Licenses;