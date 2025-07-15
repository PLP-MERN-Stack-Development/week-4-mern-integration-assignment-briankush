// Update API URL and add better auth handling
const API_URL = 'http://localhost:5000'; // Adjust to match your backend

// Enhanced auth header function with better token handling
const getAuthHeaders = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.warn("No user found in localStorage");
      return {};
    }
    
    const user = JSON.parse(userString);
    if (!user.token) {
      console.warn("User exists but no token found");
      return {};
    }
    
    // Log token for debugging
    console.log("Using auth token:", user.token.substring(0, 10) + "...");
    
    return {
      'Authorization': `Bearer ${user.token}`
    };
  } catch (e) {
    console.error("Error getting auth headers:", e);
    return {};
  }
};

// Helper for error handling
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to get error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    } catch (e) {
      // If can't parse JSON, use status text
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
  }
  
  // Check if response is HTML instead of JSON (common server error)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    throw new Error('Server returned HTML instead of JSON. Is your API server running?');
  }
  
  return response.json();
};

export const postService = {
  async getAllPosts() {
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    } catch (err) {
      console.error("Error fetching posts:", err);
      throw new Error('Failed to fetch posts. Check the server connection.');
    }
  },
  
  async getPost(id) {
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching post:", err);
      throw new Error('Failed to fetch post');
    }
  },
  
  async createPost(postData) {
    try {
      console.log("Creating post...");
      
      // Get auth headers
      const headers = getAuthHeaders();
      
      // Debug log
      console.log("Request headers:", {
        authorization: headers.Authorization ? "Bearer [token]" : "None"
      });
      
      // Make the POST request with correct CORS configuration
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: headers,
        body: postData,
        // Remove 'include' to avoid CORS issues with wildcard origin
        credentials: 'same-origin' // or omit this line entirely
      });
      
      // Handle response
      if (res.ok) {
        return await res.json();
      }
      
      // Handle error responses
      if (res.status === 500) {
        console.error("Server error (500)");
        let errorText = '';
        
        try {
          // Try to get error message from response
          const errorData = await res.json();
          errorText = errorData.message || errorData.error || 'Server error';
          console.error("Server error details:", errorData);
        } catch (parseError) {
          // If JSON parsing fails, get text
          try {
            errorText = await res.text();
            console.error("Server error text:", errorText);
          } catch (textError) {
            errorText = 'Unknown server error';
          }
        }
        
        const error = new Error(`Server error: ${errorText}`);
        error.status = 500;
        throw error;
      }
      
      // Handle other errors
      const error = new Error(`Request failed with status: ${res.status}`);
      error.status = res.status;
      throw error;
      
    } catch (err) {
      console.error("API error:", err);
      throw err;
    }
  },
  
  async updatePost(id, postData) {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  },
  
  async deletePost(id) {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },
};

export const authService = {
  async login(credentials) {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${res.status}`);
      }
      
      return await res.json();
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.message || 'Login failed');
    }
  },
  
  async register(userData) {
    try {
      // Log registration data (without password)
      console.log("Registering user:", {
        username: userData.username,
        email: userData.email,
        role: userData.role || 'user'
      });
      
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed: ${res.status}`);
      }
      
      return await res.json();
    } catch (err) {
      console.error("Registration error:", err);
      throw new Error(err.message || 'Registration failed');
    }
  }
};

export const userService = {
  async getAllUsers() {
    const res = await fetch('/api/users', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  
  async getUserProfile() {
    const res = await fetch('/api/users/profile', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
};
  
  
