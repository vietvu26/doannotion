import { getApiUrl } from '../config/api.config';
import axios from 'axios';

interface SignUpResult {
  success: boolean;
  message: string;
  userId?: string | number;
}

interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string | number;
    email: string;
    phone: string;
    name?: string;
  };
}

export const signUpWithEmail = async (
  email: string,
  phone: string
): Promise<SignUpResult> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        phone: phone.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Thông tin không hợp lệ. Vui lòng thử lại.',
      };
    }

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Thông tin hợp lệ. Vui lòng tạo mật khẩu.',
      };
    } else {
      return {
        success: false,
        message: result.error || 'Thông tin không hợp lệ. Vui lòng thử lại.',
      };
    }
  } catch (error: any) {
    console.error('signUpWithEmail error:', error);
    let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
    if (error.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const registerComplete = async (
  email: string,
  password: string
): Promise<SignUpResult> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/register-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }

    if (result.success && result.userId) {
      return {
        success: true,
        message: result.message || 'Đăng ký thành công',
        userId: result.userId,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: any) {
    console.error('registerComplete error:', error);
    let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
    if (error.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const loginWithEmail = async (
  email: string,
  password: string,
  fcmToken?: string
): Promise<LoginResult> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
        fcmToken: fcmToken || null,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Đăng nhập thất bại. Vui lòng thử lại.',
      };
    }

    if (result.success && result.token && result.user) {
      return {
        success: true,
        message: result.message || 'Đăng nhập thành công',
        token: result.token,
        user: result.user,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Đăng nhập thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: any) {
    console.error('loginWithEmail error:', error);
    let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
    if (error.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const updatePassword = async (
  userId: string | number,
  newPassword: string
): Promise<SignUpResult> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/set-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        password: newPassword,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.error || 'Tạo mật khẩu thất bại. Vui lòng thử lại.',
      };
    }

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Mật khẩu đã được tạo thành công',
        userId: result.userId || userId,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Tạo mật khẩu thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: any) {
    console.error('updatePassword error:', error);
    let errorMessage = 'Tạo mật khẩu thất bại. Vui lòng thử lại.';
    if (error.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const forgotPassword = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    let result;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error('Error parsing JSON:', jsonError);
        return {
          success: false,
          message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
        };
      }
    } else {
      if (!response.ok) {
        return {
          success: false,
          message: `Lỗi server (${response.status}). Vui lòng kiểm tra lại server hoặc thử lại sau.`,
        };
      }
      return {
        success: false,
        message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result?.error || `Lỗi server (${response.status}). Vui lòng thử lại.`,
      };
    }

    if (result && result.success) {
      return {
        success: true,
        message: result.message || 'Mã OTP đã được gửi đến email của bạn',
      };
    } else {
      return {
        success: false,
        message: result?.error || 'Gửi yêu cầu thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: any) {
    console.error('forgotPassword error:', error);
    let errorMessage = 'Gửi yêu cầu thất bại. Vui lòng thử lại.';
    if (error?.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword,
      }),
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    let result;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error('Error parsing JSON:', jsonError);
        return {
          success: false,
          message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
        };
      }
    } else {
      if (!response.ok) {
        return {
          success: false,
          message: `Lỗi server (${response.status}). Vui lòng kiểm tra lại server hoặc thử lại sau.`,
        };
      }
      return {
        success: false,
        message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: result?.error || `Lỗi server (${response.status}). Vui lòng thử lại.`,
      };
    }

    if (result && result.success) {
      return {
        success: true,
        message: result.message || 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.',
      };
    } else {
      return {
        success: false,
        message: result?.error || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',
      };
    }
  } catch (error: any) {
    console.error('resetPassword error:', error);
    let errorMessage = 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
    if (error?.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const verifySignupOTP = async (
  email: string,
  otp: string
): Promise<{ success: boolean; message: string; email?: string; phone?: string }> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/verify-signup-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        otp: otp.trim(),
      }),
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    let result;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error('Error parsing JSON:', jsonError);
        return {
          success: false,
          message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
        };
      }
    } else {
      if (!response.ok) {
        return {
          success: false,
          message: `Lỗi server (${response.status}). Vui lòng kiểm tra lại server hoặc thử lại sau.`,
        };
      }
      return {
        success: false,
        message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
      };
    }

    if (!response.ok || (result && result.success === false)) {
      const errorMessage = result?.error || result?.message || `Lỗi server (${response.status}). Vui lòng thử lại.`;
      return {
        success: false,
        message: errorMessage,
      };
    }

    if (result && result.success === true) {
      return {
        success: true,
        message: result.message || 'Xác thực email thành công. Vui lòng tạo mật khẩu.',
        email: result.email,
        phone: result.phone,
      };
    }

    return {
      success: false,
      message: result?.error || result?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.',
    };
  } catch (error: any) {
    console.error('verifySignupOTP error:', error);
    let errorMessage = 'Xác thực OTP thất bại. Vui lòng thử lại.';
    if (error?.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const resendSignupOTP = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/resend-signup-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    let result;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error('Error parsing JSON:', jsonError);
        return {
          success: false,
          message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
        };
      }
    } else {
      if (!response.ok) {
        return {
          success: false,
          message: `Lỗi server (${response.status}). Vui lòng kiểm tra lại server hoặc thử lại sau.`,
        };
      }
      return {
        success: false,
        message: 'Lỗi xử lý phản hồi từ server. Vui lòng thử lại.',
      };
    }

    if (!response.ok || (result && result.success === false)) {
      const errorMessage = result?.error || result?.message || `Lỗi server (${response.status}). Vui lòng thử lại.`;
      return {
        success: false,
        message: errorMessage,
      };
    }

    if (result && result.success === true) {
      return {
        success: true,
        message: result.message || 'Mã OTP mới đã được gửi đến email của bạn',
      };
    }

    return {
      success: false,
      message: result?.error || result?.message || 'Gửi lại OTP thất bại. Vui lòng thử lại.',
    };
  } catch (error: any) {
    console.error('resendSignupOTP error:', error);
    let errorMessage = 'Gửi lại OTP thất bại. Vui lòng thử lại.';
    if (error?.message && error.message.includes('Network request failed')) {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export interface InviteUsersParams {
  notionId: number;
  emails: string[];
  permission: 'full' | 'comment' | 'view';
  inviterName?: string;
  notionTitle?: string;
}

export const inviteUsers = async (
  params: InviteUsersParams
): Promise<{ success: boolean; message: string; emailSent?: number; fcmSent?: number }> => {
  try {
    const API_URL = getApiUrl();
    const response = await axios.post(`${API_URL}/api/invite-users`, params);

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Đã gửi lời mời thành công',
        emailSent: response.data.emailSent,
        fcmSent: response.data.fcmSent,
      };
    }

    return {
      success: false,
      message: response.data?.error || 'Không thể gửi lời mời. Vui lòng thử lại.',
    };
  } catch (error: any) {
    console.error('Error inviting users:', error);
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'Không thể gửi lời mời. Vui lòng thử lại.';
    return {
      success: false,
      message: errorMessage,
    };
  }
};
