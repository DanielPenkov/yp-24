const ProfileSettings = () => {
    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
            <p className="text-gray-500">Update your profile information here.</p>
            <div className="space-y-4 mt-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="border border-gray-300 p-2 rounded w-full"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 p-2 rounded w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 p-2 rounded w-full"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Save Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;