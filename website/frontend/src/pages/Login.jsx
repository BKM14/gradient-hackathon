import { useState } from "react";
import { TextInput, PasswordInput, Button, Container, Title, Group, Text, Paper } from "@mantine/core";
import { useForm } from '@mantine/form';
import img from "../assets/landing.svg";
import { useNavigate } from "react-router-dom";

export function UserAuth({ type }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      name: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      ...(type === 'signup' && {
        name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      })
    },
  });

  async function handleSubmit(values) {
    setLoading(true);
    const url = import.meta.env.VITE_API_URL + (type === 'signup' ? '/auth/signup' : '/auth/signin');
    const payload = type === 'signup' ? values : {
      email: values.email,
      password: values.password
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store the token
      localStorage.setItem('token', data.token);
      navigate("/onboard"); // Navigate to disability form for onboarding
    } catch (e) {
      alert(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-2">
      <div className="flex items-center justify-center bg-blue-50">
        <img src={img} alt="landing logo" className="w-4/5 h-auto"/>
      </div>
      <Container className="flex items-center w-full justify-center h-screen bg-gradient-to-br from-blue-300 to-blue-50">
        <Paper shadow="md" radius="md" className="p-8 w-full md:w-2/3">
          <Title order={2} className="text-center mb-8 font-bold text-gray-800">
            Welcome to AED
            <Text size="sm" color="dimmed" mt={4}>
              {type === 'signup' ? 'Create a new account' : 'Sign in to your account'}
            </Text>
          </Title>

          <div className="space-y-4">
            <TextInput 
              label="Email" 
              placeholder="johndoe@gmail.com" 
              {...form.getInputProps('email')} 
              required 
              size="md"
              className="transition-all duration-200 hover:shadow-sm"
            />

            <PasswordInput 
              label="Password" 
              placeholder="Enter your password" 
              {...form.getInputProps('password')} 
              required 
              size="md"
              className="transition-all duration-200 hover:shadow-sm"
            />

            {type === 'signup' && (
              <TextInput 
                label="Name" 
                placeholder="Enter your full name" 
                {...form.getInputProps('name')} 
                size="md"
                className="transition-all duration-200 hover:shadow-sm"
              />
            )}

            <Button 
              onClick={() => handleSubmit(form.values)}
              fullWidth 
              loading={loading} 
              size="md"
              className="mt-6 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {type === 'signup' ? 'Create Account' : 'Sign In'}
            </Button>
          </div>

          <Group position="center" mt="xl">
            <Text size="sm">
              {type === 'signup' ? 'Already have an account?' : "Don't have an account?"} {' '}
              <a href={type === 'signup' ? '/auth/signin' : '/auth/signup'} className="text-blue-600 hover:text-blue-700 font-medium">
                {type === 'signup' ? 'Sign in' : 'Sign up'}
              </a>
            </Text>
          </Group>
        </Paper>
      </Container>
    </div>
  );
}
