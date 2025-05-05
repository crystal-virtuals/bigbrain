import { TextLink } from '@components/text';
import { PageFooter, PageLayout, PageNavbar, PageContent} from '@components/page-layout';
import { useAuth } from '@hooks/auth';
import { useNavigate } from 'react-router-dom';

const description =
  'Create your own immersive game complete with questions, images, and so much more! Add questions, host a session, and invite some friends to get the party started!';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const authenticate = () => {
    if (user && user.authenticated) {
      return navigate('/dashboard');
    }
    return navigate('/login');
  };

  return (
    <PageLayout navbar={<PageNavbar />} footer={<PageFooter />}>
      <PageContent title="Welcome to BigBrain" description={description}>
        <div className="flex flex-row justify-between items-center py-20 gap-x-8">
          <button
            type="button"
            onClick={authenticate}
            className="rounded-md bg-pink text-white px-3.5 py-2.5 text-sm font-semibold shadow-xs hover:bg-pink-600 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
          >
            Get started
          </button>
          <TextLink
            to="/register"
            className="text-sm/6 font-semibold"
          >
            Sign up today <span aria-hidden="true">&rarr;</span>
          </TextLink>
        </div>
      </PageContent>
    </PageLayout>
  );
}
