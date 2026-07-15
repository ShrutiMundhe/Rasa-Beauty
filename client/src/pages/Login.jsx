const handleSubmit = async (e) => {
        e.preventDefault();
        // This constant now correctly matches the variable used in the fetch call below
        const API_BASE_URL = 'https://rasa-beauty.onrender.com';
        
        try {
            // Updated to use API_BASE_URL instead of the undefined API_URL
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                }));
                
                if (data.user.city) {
                    localStorage.setItem('userCity', JSON.stringify(data.user.city));
                }
                if (data.user.skinType) {
                    localStorage.setItem('facialProfile', JSON.stringify({
                        skinType: data.user.skinType,
                        skinConcerns: data.user.skinConcerns || []
                    }));
                }
                if (data.user.hairType) {
                    localStorage.setItem('hairProfile', JSON.stringify({
                        hairType: data.user.hairType,
                        hairPorosity: data.user.hairPorosity || 'normal',
                        hairConcerns: data.user.hairConcerns || []
                    }));
                }
                if (data.user.bodyType) {
                    localStorage.setItem('bodyProfile', JSON.stringify({
                        bodyType: data.user.bodyType,
                        bodyConcerns: data.user.bodyConcerns || []
                    }));
                }

                if (data.user.city && data.user.city.name && data.user.skinType) {
                    navigate('/home');
                } else {
                    navigate('/onboarding/facial');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err); // Added for easier debugging
            alert('Something went wrong');
        }
    };