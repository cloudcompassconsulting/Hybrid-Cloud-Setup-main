import Register from '../components/Register';
import Layout from '../components/Layout';

const RegisterPage = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <Register />
      </div>
    </Layout>
  );
};

export default RegisterPage;
