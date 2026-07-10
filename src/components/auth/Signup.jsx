import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fullname", data.fullname);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);
        formData.append("role", data.role);
        if (data.file && data.file[0]) {
            formData.append("profilePhoto", data.file[0]);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            type="text"
                            {...register("fullname", { required: "Full name is required" })}
                            placeholder="patel"
                        />
                        {errors.fullname && <span className="text-red-500 text-sm">{errors.fullname.message}</span>}
                    </div>
                    <div className='my-2'>
                        <Label>Email <span className="text-red-500">*</span></Label>
                        <Input
                            type="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email address."
                                }
                            })}
                            placeholder="patel@gmail.com"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number <span className="text-red-500">*</span></Label>
                        <Input
                            type="text"
                            {...register("phoneNumber", { 
                                required: "Phone number is required",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Phone number must be exactly 10 digits."
                                }
                            })}
                            placeholder="8080808080"
                        />
                        {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>}
                    </div>
                    <div className='my-2'>
                        <Label>Password <span className="text-red-500">*</span></Label>
                        <Input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            placeholder="password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className="my-5">
                            <RadioGroup className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        value="student"
                                        {...register("role", { required: "Role is required" })}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        value="recruiter"
                                        {...register("role", { required: "Role is required" })}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                            {errors.role && <span className="text-red-500 text-sm block mt-1">{errors.role.message}</span>}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                                <Label>Profile <span className="text-red-500">*</span></Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    {...register("file", { required: "Profile photo is required" })}
                                    className="cursor-pointer"
                                />
                            </div>
                            {errors.file && <span className="text-red-500 text-sm">{errors.file.message}</span>}
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4" type="button" disabled> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup