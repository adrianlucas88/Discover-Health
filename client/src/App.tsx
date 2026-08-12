import { FormEvent, useEffect, useState } from 'react';
import {
  addResource,
  addReview,
  getCurrentUser,
  getResourcesByRegion,
  getReviewsByResource,
  login,
  logout,
  recommendResource,
  signup
} from './api';
import ResourceMap from './components/ResourceMap';
import type {
  HealthcareResource,
  NewHealthcareResource,
  Review,
  User
} from './types';


const emptyResource: NewHealthcareResource = {
  name: '',
  category: '',
  country: 'UK',
  region: '',
  lat: '',
  lon: '',
  description: ''
};

function App() {
  const [region, setRegion] = useState('London');
  const [resources, setResources] = useState<HealthcareResource[]>([]);
  const [newResource, setNewResource] = useState<NewHealthcareResource>(emptyResource);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [reviewsByResource, setReviewsByResource] = useState<Record<number, Review[]>>({});
  const [reviewInputs, setReviewInputs] = useState<Record<number, string>>({});
  const searchResources = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const data = await getResourcesByRegion(region);
      setResources(data);

      if (data.length === 0) {
        setMessage('No healthcare resources were found for this region.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to search resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  async function checkSession() {
    try {
      const data = await getCurrentUser();
      setCurrentUser(data.user);
    } catch {
      setCurrentUser(null);
    }
  }

  checkSession();
}, []);
  const handleRecommend = async (id: number) => {
    setMessage('');
    setError('');

    try {
      const updatedResource = await recommendResource(id);

      setResources((currentResources) =>
        currentResources.map((resource) =>
          resource.id === updatedResource.id ? updatedResource : resource
        )
      );

      setMessage(`Recommendation added for ${updatedResource.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to recommend resource.');
    }
  };

  const handleAddResource = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const createdResource = await addResource(newResource);

      setResources((currentResources) => {
        if (createdResource.region.toLowerCase() === region.toLowerCase()) {
          return [...currentResources, createdResource];
        }

        return currentResources;
      });

      setNewResource(emptyResource);
      setMessage(`${createdResource.name} was addedsuccessfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add resource.');
    }
  };
const handleMapClick = (lat: number, lon: number) => {
  setNewResource((currentResource) => ({
    ...currentResource,
    lat: lat.toFixed(5),
    lon: lon.toFixed(5)
  }));

  setMessage('Map location selected. Latitude and longitude were added to the form.');
  setError('');
};
const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError('');
  setMessage('');

  try {
    const data = await login(authUsername, authPassword);
    setCurrentUser(data.user);
    setMessage('Login successful.');
    setAuthPassword('');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Login failed.');
  }
};

const handleSignup = async () => {
  setError('');
  setMessage('');

  try {
    const data = await signup(authUsername, authPassword);
    setCurrentUser(data.user);
    setMessage('Signup successful.');
    setAuthPassword('');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Signup failed.');
  }
};

const handleLogout = async () => {
  setError('');
  setMessage('');

  try {
    await logout();
    setCurrentUser(null);
    setMessage('Logout successful.');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Logout failed.');
  }
};

const loadReviews = async (resourceId: number) => {
  setError('');
  setMessage('');

  try {
    const reviews = await getReviewsByResource(resourceId);

    setReviewsByResource((currentReviews) => ({
      ...currentReviews,
      [resourceId]: reviews
    }));
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Could not load reviews.');
  }
};

const handleReviewInputChange = (resourceId: number, value: string) => {
  setReviewInputs((currentInputs) => ({
    ...currentInputs,
    [resourceId]: value
  }));
};

const handleAddReview = async (resourceId: number) => {
  setError('');
  setMessage('');

  const reviewText = reviewInputs[resourceId] || '';

  try {
    const newReview = await addReview(resourceId, reviewText);

    setReviewsByResource((currentReviews) => ({
      ...currentReviews,
      [resourceId]: [
        newReview,
        ...(currentReviews[resourceId] || [])
      ]
    }));

    setReviewInputs((currentInputs) => ({
      ...currentInputs,
      [resourceId]: ''
    }));

    setMessage('Review added successfully.');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Could not add review.');
  }
};

  return (
    <main className="page">
      <section className="hero">
        <h1>DiscoverHealth</h1>
        <p>
          Search, add and recommend local healthcare resources using the
          DiscoverHealth directory.
        </p>
      </section>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
<section className="card auth-card">
  <h2>User account</h2>

  {currentUser ? (
    <div>
      <p>
        Logged in as <strong>{currentUser.username}</strong>
      </p>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  ) : (
    <form className="auth-form" onSubmit={handleLogin}>
      <label>
        Username
        <input
          type="text"
          value={authUsername}
          onChange={(event) => setAuthUsername(event.target.value)}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={authPassword}
          onChange={(event) => setAuthPassword(event.target.value)}
          required
        />
      </label>

      <div className="auth-actions">
        <button type="submit">Login</button>
        <button type="button" onClick={handleSignup}>
          Signup
        </button>
      </div>
    </form>
  )}
</section>
      <section className="card">
        <h2>Search healthcare resources</h2>

        <form onSubmit={searchResources} className="search-form">
          <label htmlFor="region">Search by region or clinic name</label>
          <div className="search-row">
            <input
              id="region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="Example: London"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Search results</h2>

        {resources.length === 0 ? (
          <p>No resources are currently displayed. Search by region to begin.</p>
        ) : (
          <div className="resource-list">
            {resources.map((resource) => (
              <article key={resource.id} className="resource-card">
                <h3>{resource.name}</h3>
                <p>
                  <strong>Category:</strong> {resource.category}
                </p>
                <p>
                  <strong>Region:</strong> {resource.region}, {resource.country}
                </p>
                <p>{resource.description}</p>
                <p>
                  <strong>Recommendations:</strong> {resource.recommendations}
                </p><button type="button" onClick={() => handleRecommend(resource.id)}>
                  Recommend
                </button>
                <div className="review-section">
  <h4>Reviews</h4>

  <button
    type="button"
    onClick={() => loadReviews(resource.id)}
  >
    Show reviews
  </button>

  <div className="review-list">
    {(reviewsByResource[resource.id] || []).map((review) => (
      <div key={review.id} className="review-item">
        <p>{review.review}</p>
        <small>By {review.username}</small>
      </div>
    ))}
  </div>

  {currentUser ? (
    <div className="review-form">
      <textarea
        value={reviewInputs[resource.id] || ''}
        onChange={(event) =>
          handleReviewInputChange(resource.id, event.target.value)
        }
        placeholder="Write a short review"
      />

      <button
        type="button"
        onClick={() => handleAddReview(resource.id)}
      >
        Add review
      </button>
    </div>
  ) : (
    <p className="hint-text">Log in to add a review.</p>
  )}
</div>
              </article>
            ))}
          </div>
        )}
      </section>
<section className="card">
  <h2>Healthcare resources map</h2>
  <ResourceMap resources={resources} onMapClick={handleMapClick} />
</section>
      <section className="card">
        <h2>Add healthcare resource</h2>

        <form onSubmit={handleAddResource} className="add-form">
          <label>
            Name
            <input
              value={newResource.name}
              onChange={(event) =>
                setNewResource({ ...newResource, name: event.target.value })
              }
            />
          </label>

          <label>
            Category
            <input
              value={newResource.category}
              onChange={(event) =>
                setNewResource({ ...newResource, category: event.target.value })
              }
            />
          </label>

          <label>
            Country
            <input
              value={newResource.country}
              onChange={(event) =>
                setNewResource({ ...newResource, country: event.target.value })
              }
            />
          </label>

          <label>
            Region
            <input
              value={newResource.region}
              onChange={(event) =>
                setNewResource({ ...newResource, region: event.target.value })
              }
            />
          </label>

          <label>
            Latitude
            <input
              value={newResource.lat}
              onChange={(event) =>
                setNewResource({ ...newResource, lat: event.target.value })
              }
            />
          </label>

          <label>
            Longitude
            <input
              value={newResource.lon}
              onChange={(event) =>
                setNewResource({ ...newResource, lon: event.target.value })
              }
            />
          </label>

          <label>
            Description
            <textarea
              value={newResource.description}
              onChange={(event) =>
                setNewResource({ ...newResource, description: event.target.value })
              }
            />
          </label>

          <button type="submit">Add resource</button>
        </form>
      </section>
    </main>
  );
}

export default App;