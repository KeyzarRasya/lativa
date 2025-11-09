import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

const INCIDENTS_COLLECTION = 'incidents';

/**
 * Incident Model Structure in Firestore:
 * {
 *   type: string ('Unverified' | 'Verified' | 'Handled' | 'Resolved'),
 *   status: string ('unverified' | 'verified' | 'handled' | 'resolved'),
 *   zone: string ('green' | 'yellow' | 'red'),
 *   location: string,
 *   description: string,
 *   coordinates: {
 *     lat: number,
 *     lng: number
 *   },
 *   confidence: number (0-100),
 *   address: string,
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 *   createdBy: string (optional - user ID),
 *   metadata: object (optional - additional data)
 * }
 */

// ==================== CREATE ====================

/**
 * Create a new incident report
 * @param {Object} incidentData - Incident data object
 * @returns {Promise<string>} Document ID of created incident
 */
export const createIncident = async (incidentData) => {
  try {
    const incident = {
      ...incidentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      confidence: incidentData.confidence || 0,
      status: incidentData.status || 'unverified',
      type: incidentData.type || 'Unverified'
    };

    const docRef = await addDoc(collection(db, INCIDENTS_COLLECTION), incident);
    console.log('Incident created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating incident:', error);
    throw error;
  }
};

// ==================== READ ====================

/**
 * Get all incidents with optional filters
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status ('active', 'unverified', 'resolved')
 * @param {number} options.limit - Maximum number of results
 * @param {string} options.orderBy - Field to order by (default: 'createdAt')
 * @returns {Promise<Array>} Array of incident objects with IDs
 */
export const getIncidents = async (options = {}) => {
  try {
    const {
      status,
      limitCount = 50,
      orderByField = 'createdAt',
      orderDirection = 'desc'
    } = options;

    let q = collection(db, INCIDENTS_COLLECTION);
    const constraints = [];

    // Add status filter if provided
    if (status) {
      constraints.push(where('status', '==', status));
    }

    // Add ordering
    constraints.push(orderBy(orderByField, orderDirection));

    // Add limit
    constraints.push(limit(limitCount));

    // Build query
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const incidents = [];

    querySnapshot.forEach((doc) => {
      incidents.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to JavaScript Date
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    return incidents;
  } catch (error) {
    console.error('Error getting incidents:', error);
    throw error;
  }
};

/**
 * Get a single incident by ID
 * @param {string} incidentId - Document ID
 * @returns {Promise<Object|null>} Incident object or null if not found
 */
export const getIncidentById = async (incidentId) => {
  try {
    const docRef = doc(db, INCIDENTS_COLLECTION, incidentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } else {
      console.log('No incident found with ID:', incidentId);
      return null;
    }
  } catch (error) {
    console.error('Error getting incident by ID:', error);
    throw error;
  }
};

/**
 * Get incidents within a geographic area (bounding box)
 * @param {Object} bounds - Geographic bounds
 * @param {number} bounds.minLat - Minimum latitude
 * @param {number} bounds.maxLat - Maximum latitude
 * @param {number} bounds.minLng - Minimum longitude
 * @param {number} bounds.maxLng - Maximum longitude
 * @returns {Promise<Array>} Array of incidents within bounds
 */
export const getIncidentsByLocation = async (bounds) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = bounds;

    // Get all incidents and filter client-side
    // Note: Firestore doesn't support compound inequalities on different fields
    const allIncidents = await getIncidents({ limitCount: 1000 });

    const filteredIncidents = allIncidents.filter(incident => {
      const lat = incident.coordinates?.lat;
      const lng = incident.coordinates?.lng;
      return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    });

    return filteredIncidents;
  } catch (error) {
    console.error('Error getting incidents by location:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for incidents
 * @param {Function} callback - Callback function to handle updates
 * @param {Object} options - Query options (same as getIncidents)
 * @returns {Function} Unsubscribe function
 */
export const subscribeToIncidents = (callback, options = {}) => {
  try {
    const {
      status,
      limitCount = 50,
      orderByField = 'createdAt',
      orderDirection = 'desc'
    } = options;

    let q = collection(db, INCIDENTS_COLLECTION);
    const constraints = [];

    if (status) {
      constraints.push(where('status', '==', status));
    }

    constraints.push(orderBy(orderByField, orderDirection));
    constraints.push(limit(limitCount));

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const incidents = [];
      querySnapshot.forEach((doc) => {
        incidents.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        });
      });
      callback(incidents);
    }, (error) => {
      console.error('Error in real-time subscription:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to incidents:', error);
    throw error;
  }
};

// ==================== UPDATE ====================

/**
 * Update an existing incident
 * @param {string} incidentId - Document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateIncident = async (incidentId, updates) => {
  try {
    const docRef = doc(db, INCIDENTS_COLLECTION, incidentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('Incident updated:', incidentId);
  } catch (error) {
    console.error('Error updating incident:', error);
    throw error;
  }
};

/**
 * Update incident status
 * @param {string} incidentId - Document ID
 * @param {string} newStatus - New status ('unverified', 'verified', 'handled', 'resolved')
 * @returns {Promise<void>}
 */
export const updateIncidentStatus = async (incidentId, newStatus) => {
  try {
    const statusTypeMap = {
      unverified: 'Unverified',
      verified: 'Verified',
      handled: 'Handled',
      resolved: 'Resolved'
    };

    // Zone tidak lagi terikat dengan status - zone adalah independent field
    await updateIncident(incidentId, {
      status: newStatus,
      type: statusTypeMap[newStatus] || 'Unverified'
    });
  } catch (error) {
    console.error('Error updating incident status:', error);
    throw error;
  }
};

// ==================== DELETE ====================

/**
 * Delete an incident
 * @param {string} incidentId - Document ID
 * @returns {Promise<void>}
 */
export const deleteIncident = async (incidentId) => {
  try {
    const docRef = doc(db, INCIDENTS_COLLECTION, incidentId);
    await deleteDoc(docRef);
    console.log('Incident deleted:', incidentId);
  } catch (error) {
    console.error('Error deleting incident:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get incident statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getIncidentStats = async () => {
  try {
    const allIncidents = await getIncidents({ limitCount: 1000 });

    const stats = {
      total: allIncidents.length,
      active: allIncidents.filter(i => i.status === 'active').length,
      unverified: allIncidents.filter(i => i.status === 'unverified').length,
      resolved: allIncidents.filter(i => i.status === 'resolved').length,
      averageConfidence: allIncidents.reduce((sum, i) => sum + (i.confidence || 0), 0) / allIncidents.length || 0
    };

    return stats;
  } catch (error) {
    console.error('Error getting incident stats:', error);
    throw error;
  }
};

/**
 * Calculate time difference for display (e.g., "2 menit lalu")
 * @param {Date} date - Date object
 * @returns {string} Formatted time difference
 */
export const getTimeAgo = (date) => {
  if (!date) return 'Unknown';

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID');
};

/**
 * Format incident data for display on map
 * @param {Object} incident - Raw incident data from Firestore
 * @returns {Object} Formatted incident data
 */
export const formatIncidentForMap = (incident) => {
  return {
    id: incident.id,
    type: incident.type,
    status: incident.status,
    zone: incident.zone || 'yellow', // default to yellow if no zone specified
    location: incident.location,
    description: incident.description,
    coordinates: [incident.coordinates.lat, incident.coordinates.lng],
    confidence: incident.confidence,
    time: getTimeAgo(incident.createdAt),
    address: incident.address
  };
};

export default {
  createIncident,
  getIncidents,
  getIncidentById,
  getIncidentsByLocation,
  subscribeToIncidents,
  updateIncident,
  updateIncidentStatus,
  deleteIncident,
  getIncidentStats,
  getTimeAgo,
  formatIncidentForMap
};
