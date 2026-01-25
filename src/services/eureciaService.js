/**
 * Eurecia API Service
 * Handles all interactions with the Eurecia HR system
 */

const EURECIA_API_URL = process.env.REACT_APP_EURECIA_API_URL || 'https://api.eurecia.com/v1';
const EURECIA_API_KEY = process.env.REACT_APP_EURECIA_API_KEY;

/**
 * Authenticate with Eurecia API
 */
export const authenticateEurecia = async (username, password) => {
  try {
    const response = await fetch(`${EURECIA_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EURECIA_API_KEY}`
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return {
      success: true,
      token: data.token,
      user: data.user
    };
  } catch (error) {
    console.error('Eurecia authentication error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get employee leave balance
 */
export const getLeaveBalance = async (employeeId, token) => {
  try {
    const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/leaves`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leave balance');
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        annualLeave: data.annual_leave_remaining,
        sickLeave: data.sick_leave_available,
        personalDays: data.personal_days_remaining,
        totalDays: data.total_leave_days,
        usedDays: data.used_leave_days
      }
    };
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get employee profile information
 */
export const getEmployeeProfile = async (employeeId, token) => {
  try {
    const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee profile');
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        name: data.full_name,
        email: data.email,
        department: data.department,
        position: data.job_title,
        startDate: data.start_date,
        managerId: data.manager_id,
        location: data.location
      }
    };
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get salary and payroll information
 */
export const getSalaryInfo = async (employeeId, token) => {
  try {
    const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/payslips`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch salary information');
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        salary: data.base_salary,
        currency: data.currency,
        paymentFrequency: data.payment_frequency,
        lastPayslip: data.last_payslip_date,
        nextPayment: data.next_payment_date
      }
    };
  } catch (error) {
    console.error('Error fetching salary info:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Request time off
 */
export const requestTimeOff = async (employeeId, token, leaveRequest) => {
  try {
    const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/leaves/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start_date: leaveRequest.startDate,
        end_date: leaveRequest.endDate,
        leave_type: leaveRequest.leaveType,
        reason: leaveRequest.reason
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit leave request');
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        requestId: data.request_id,
        status: data.status,
        message: 'Leave request submitted successfully'
      }
    };
  } catch (error) {
    console.error('Error requesting time off:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get employee documents
 */
export const getEmployeeDocuments = async (employeeId, token) => {
  try {
    const response = await fetch(`${EURECIA_API_URL}/employees/${employeeId}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.document_type,
        uploadDate: doc.upload_date,
        url: doc.download_url
      }))
    };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
