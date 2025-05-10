import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/groups');
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const fetchGroupById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/v1/groups/${id}`);
      setCurrentGroup(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const createGroup = async (groupData, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        'http://localhost:5000/api/v1/groups',
        groupData,
        config
      );
      setGroups([...groups, response.data]);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      return { success: false, error: err.response?.data };
    }
  };

  const joinGroup = async (groupId, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(
        `http://localhost:5000/api/v1/groups/${groupId}/join`,
        {},
        config
      );
      await fetchGroupById(groupId);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      return { success: false, error: err.response?.data };
    }
  };

  const leaveGroup = async (groupId, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(
        `http://localhost:5000/api/v1/groups/${groupId}/leave`,
        {},
        config
      );
      await fetchGroupById(groupId);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      return { success: false, error: err.response?.data };
    }
  };

  const fetchResources = async (groupId, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(
        `http://localhost:5000/api/v1/resources/group/${groupId}`,
        config
      );
      setResources(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const addResource = async (resourceData, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        'http://localhost:5000/api/v1/resources',
        resourceData,
        config
      );
      setResources([...resources, response.data]);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      return { success: false, error: err.response?.data };
    }
  };

  const deleteResource = async (resourceId, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.delete(
        `http://localhost:5000/api/v1/resources/${resourceId}`,
        config
      );
      setResources(resources.filter(resource => resource._id !== resourceId));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      return { success: false, error: err.response?.data };
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        currentGroup,
        resources,
        loading,
        error,
        fetchGroups,
        fetchGroupById,
        createGroup,
        joinGroup,
        leaveGroup,
        fetchResources,
        addResource,
        deleteResource
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContext;