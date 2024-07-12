import { useSelector } from "react-redux"

export default function Profile() {
  const currentUser = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>My Profile</h1>
      <form className="flex flex-col gap-4">
        <img src={currentUser.image} alt="avatar"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <input type="text" placeholder="Username" id="username" className="border p-3 rounded-lg" />
        <input type="text" placeholder="Email" id="email" className="border p-3 rounded-lg" />
        <input type="text" placeholder="Password" id="password" className="border p-3 rounded-lg" />
        <button className='text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80' style={{ backgroundColor: '#00B98E' }} >Update Information</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-blue-700 cursor-pointer">Logout</span>
      </div>
    </div>
  )
}
