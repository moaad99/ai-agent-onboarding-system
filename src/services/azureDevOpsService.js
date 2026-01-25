/**
 * Azure DevOps API Service
 * Handles all interactions with Azure DevOps
 */

const AZURE_DEVOPS_ORG = process.env.REACT_APP_AZURE_DEVOPS_ORG || 'your-organization';
const AZURE_PAT = process.env.REACT_APP_AZURE_PAT;
const API_VERSION = '7.0';

/**
 * Get authorization headers for Azure DevOps API
 */
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Basic ${btoa(`:${AZURE_PAT}`)}`
});

/**
 * Get all projects the user has access to
 */
export const getUserProjects = async () => {
  try {
    const response = await fetch(
      `https://dev.azure.com/${AZURE_DEVOPS_ORG}/_apis/projects?api-version=${API_VERSION}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.value.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        url: project.url,
        state: project.state
      }))
    };
  } catch (error) {
    console.error('Error fetching Azure DevOps projects:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get repositories for a specific project
 */
export const getRepositories = async (projectId) => {
  try {
    const response = await fetch(
      `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${projectId}/_apis/git/repositories?api-version=${API_VERSION}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.value.map(repo => ({
        id: repo.id,
        name: repo.name,
        url: repo.remoteUrl,
        defaultBranch: repo.defaultBranch,
        size: repo.size
      }))
    };
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get work items assigned to user
 */
export const getUserWorkItems = async (projectId, userId) => {
  try {
    const wiqlQuery = {
      query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType] 
              FROM WorkItems 
              WHERE [System.AssignedTo] = @Me 
              AND [System.State] <> 'Closed' 
              ORDER BY [System.CreatedDate] DESC`
    };

    const response = await fetch(
      `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${projectId}/_apis/wit/wiql?api-version=${API_VERSION}`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(wiqlQuery)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch work items');
    }

    const data = await response.json();
    
    if (data.workItems && data.workItems.length > 0) {
      // Get full work item details
      const workItemIds = data.workItems.map(wi => wi.id).join(',');
      const detailsResponse = await fetch(
        `https://dev.azure.com/${AZURE_DEVOPS_ORG}/_apis/wit/workitems?ids=${workItemIds}&api-version=${API_VERSION}`,
        { headers: getHeaders() }
      );

      const detailsData = await detailsResponse.json();
      
      return {
        success: true,
        data: detailsData.value.map(wi => ({
          id: wi.id,
          title: wi.fields['System.Title'],
          type: wi.fields['System.WorkItemType'],
          state: wi.fields['System.State'],
          assignedTo: wi.fields['System.AssignedTo']?.displayName,
          createdDate: wi.fields['System.CreatedDate']
        }))
      };
    }

    return {
      success: true,
      data: []
    };
  } catch (error) {
    console.error('Error fetching work items:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get project team members
 */
export const getTeamMembers = async (projectId) => {
  try {
    const response = await fetch(
      `https://dev.azure.com/${AZURE_DEVOPS_ORG}/_apis/projects/${projectId}/teams?api-version=${API_VERSION}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.value.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description
      }))
    };
  } catch (error) {
    console.error('Error fetching team members:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get recent builds for a project
 */
export const getRecentBuilds = async (projectId) => {
  try {
    const response = await fetch(
      `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${projectId}/_apis/build/builds?api-version=${API_VERSION}&$top=10`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch builds');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.value.map(build => ({
        id: build.id,
        buildNumber: build.buildNumber,
        status: build.status,
        result: build.result,
        queueTime: build.queueTime,
        startTime: build.startTime,
        finishTime: build.finishTime
      }))
    };
  } catch (error) {
    console.error('Error fetching builds:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get pull requests for a repository
 */
export const getPullRequests = async (projectId, repositoryId) => {
  try {
    const response = await fetch(
      `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${projectId}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=${API_VERSION}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pull requests');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.value.map(pr => ({
        id: pr.pullRequestId,
        title: pr.title,
        status: pr.status,
        createdBy: pr.createdBy.displayName,
        creationDate: pr.creationDate,
        sourceRefName: pr.sourceRefName,
        targetRefName: pr.targetRefName
      }))
    };
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
