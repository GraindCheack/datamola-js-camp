/** Class representing chat api requests*/
class ChatApiService {
  /**
   * Create a api service.
   * @param {string} server - server url
   */
  constructor(server) {
    this.config = {
      server: server,
    };
    this.user = {};
  }

  /**
   * Send request
   * 
   * @param {string} method - request method (GET, POST...)
   * @param {string} endpoint - endpoint of url
   * @param {object} inputData - request body
   * @returns {Promise} - response
   */
  async _backendLookup(method, endpoint, inputData) {
    const header = new Headers();
    const { server } = this.config;
    const { token } = this.user;
    if (token) {
      header.append('Authorization', `Bearer ${token}`);
      header.append('Content-Type', 'application/json');
    }

    const requestOptions = {
      method: method,
      headers: header,
    };

    if (inputData) {
      requestOptions['body'] = inputData instanceof FormData ? inputData : JSON.stringify(inputData);
    }

    try {
      const response = await fetch(`${server}${endpoint}`, requestOptions);
      const responseText = await response.text()
      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        data = {
          response: responseText,
        };
      }
      if (!response.ok) {
        data.status = response.status;
      }
      return data;
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  /** Get user list promise */
  apiGetUsers() {
    const endpoint = `/users`;
    return this._backendLookup('GET', endpoint);
  }

  /**
   * Get message list promise
   * 
   * @param {number} skip - number of skiped messages
   * @param {number} top - number of paginated messages 
   * @param {object} filterConfig - filter config object, supports:
   *    {Date} dateFrom - minimal message date
   *    {Date} dateTo - maximal message date
   *    {string} author - message author name
   *    {string} text - message text
   * @returns {Promise} - response
   */
  apiGetMessages(skip, top, filterConfig) {
    const { text, author, dateFrom, dateTo } = filterConfig;
    let endpoint = skip || top || filterConfig ? `/messages?` : '/messages';
    if (skip)
      endpoint += `skip=${skip}`;
    if (top)
      endpoint += `&top=${top}`;
    if (text)
      endpoint += `&text=${text}`;
    if (author)
      endpoint += `&author=${author}`;
    if (dateFrom)
      endpoint += `&dateFrom=${dateFrom}`;
    if (dateTo)
      endpoint += `&dateTo=${dateTo}`;
    endpoint.replace('?&', '?');
    return this._backendLookup('GET', endpoint);
  }

  /** Sign in request */
  apiSignIn(formData) {
    const endpoint = `/auth/login`;
    return this._backendLookup('POST', endpoint, formData);
  }

  /** Sign up request */
  apiSignUp(formData) {
    const endpoint = `/auth/register`;
    return this._backendLookup('POST', endpoint, formData);
  }

  /** Sign out request */
  apiSignOut() {
    const endpoint = `/auth/logout`;
    return this._backendLookup('POST', endpoint);
  }

  /** Create message request */
  apiCreateMessage(msg) {
    const endpoint = `/messages`;
    return this._backendLookup('POST', endpoint, msg);
  }

  /** Edit message request */
  apiEditMessage(msg, id) {
    const endpoint = `/messages/${id}`;
    return this._backendLookup('PUT', endpoint, msg);
  }

  /** Remove message request */
  apiRemoveMessage(id) {
    const endpoint = `/messages/${id}`;
    return this._backendLookup('DELETE', endpoint);
  }
}

export default ChatApiService;