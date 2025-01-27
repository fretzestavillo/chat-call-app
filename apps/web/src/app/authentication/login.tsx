import { useForm, SubmitHandler } from 'react-hook-form';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { SignUpInput } from '../Chat/tools/type';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<SignUpInput>();
  const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
    const BaseUrl = 'http://localhost:3000';
    const response = await fetch(`${BaseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    // console.log(result.error)
    result.error === 'Unauthorized'
      ? alert('fck you should signup')
      : navigate('/Home', { state: { result } });
  };
  // navigate('/');

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="FirstName"
          {...register('firstName', { required: true })}
        />
        {errors.firstName && <span>This field is required</span>}
        <input
          placeholder="LastName"
          {...register('lastName', { required: true })}
        />
        {errors.lastName && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </>
  );
}
