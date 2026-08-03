import { FormEvent, useState } from 'react';
import { addResource, getResourcesByRegion, recommendResource } from './api';
import type { HealthcareResource, NewHealthcareResource } from './types';

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

      <section className="card">
        <h2>Search healthcare resources</h2>

        <form onSubmit={searchResources} className="search-form">
          <label htmlFor="region">Region</label>
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
              </article>
            ))}
          </div>
        )}
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