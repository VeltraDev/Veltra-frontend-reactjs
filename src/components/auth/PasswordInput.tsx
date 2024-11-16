import React, { useState, useMemo } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useFormContext } from "react-hook-form";

// Constants
const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[0-9]/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    { regex: /[!-\/:-@[-`{-~]/, text: 'At least 1 special character' },
] as const;

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5;

const STRENGTH_CONFIG = {
    colors: {
        0: 'bg-border',
        1: 'bg-red-500',
        2: 'bg-orange-500',
        3: 'bg-amber-500',
        4: 'bg-emerald-500',
    },
    texts: {
        0: 'Enter a password',
        1: 'Weak password',
        2: 'Medium password',
        3: 'Strong password',
        4: 'Very strong password',
    },
};

const PasswordInput = () => {
    const { register, formState: { errors } } = useFormContext();
    const [isVisible, setIsVisible] = useState(false);
    const [password, setPassword] = useState('');

    const calculateStrength = useMemo(() => {
        const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
            met: req.regex.test(password),
            text: req.text,
        }));
        return {
            score: requirements.filter((req) => req.met).length as StrengthScore,
            requirements,
        };
    }, [password]);

    return (
        <div className='w-full text-white'>
            <label htmlFor='password' className='block text-sm font-medium'>
                Mật khẩu
            </label>
            <div className='relative'>
                <input
                    type={isVisible ? 'text' : 'password'}
                    {...register("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Nhập mật khẩu'
                    className='w-full p-2 border-2 rounded-md bg-background outline-none text-blue-500 focus:border-blue-700 transition'
                />
                <button
                    type='button'
                    onClick={() => setIsVisible(!isVisible)}
                    className='absolute inset-y-0 right-0 flex items-center justify-center w-9'
                >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
            )}

            <div className='flex gap-2 mt-2'>
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        className={`${index < calculateStrength.score ? 'bg-green-500' : 'bg-border'} p-1 rounded-full w-full`}
                    ></span>
                ))}
            </div>

            <p className='my-2 text-sm'>
                {STRENGTH_CONFIG.texts[calculateStrength.score]}
            </p>

            <ul className='space-y-1.5'>
                {calculateStrength.requirements.map((req, index) => (
                    <li key={index} className='flex items-center space-x-2'>
                        {req.met ? <Check size={16} className='text-green-500' /> : <EyeOff size={16} className='text-gray-400' />}
                        <span>{req.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PasswordInput;
