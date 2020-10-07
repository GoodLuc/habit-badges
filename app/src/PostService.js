import axios from 'axios'
const url = 'http://localhost:5000/api/logs/'

class PostService {

  ///////////////////////////////////////
  /////// L O G S ///////////////////////
  ///////////////////////////////////////
  
  //// Get Posts
  static async getPosts() {
    try {
        const res = await axios.get(url)
        const data = res.data
        return data.map(post => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
      } catch (err) {
        return err
      }
  }

  //// Get Month
  static async getMonth(user, year, month) {
    //console.log('Getting..' + url + user + '/' + year + '/' + month)
    try {
      const res = await axios.get(url+user+'/'+year+'/'+month)
      const data = res.data
      //console.log(data)
      return data.map(post => ({
        ...post
      }))
    } catch (err) {
      return err
    }
  }

  //// Update Log
  static updateLog(user, year, month, load) {
    return axios.post(url+'update/'+user+'/'+year+'/'+month, {load})
  }

  //// Delete Posts
  static deletePost(id) {
    return axios.delete(`${url}${id}`)
  }


  ///////////////////////////////////////
  /////// U S E R S /////////////////////
  ///////////////////////////////////////

  //// Create User
  static makeUser(user) {
    return axios.post(url+'makeuser', { user })
  }

  //// Get user
  static async getUser(email) {
    try {
      const res = await axios.get(url+'user/'+email)
      const data = res.data
      return data.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt)
      }))
    } catch (err) {
      return err
    }
  }

  // Check user
  static async checkUser(email) {
    const res = await axios.get(url+'checkuser/'+email)
    try {
      return res.data
    } catch (err) {
      return err
    }
  }

  // Validate user
  static async validateUser(data) {
    const res = await axios.post(url+'validateuser/', data)
    try {
      return res.data
    } catch (err) {
      return err
    }
  }

  ///////////////////////////////////////
  /////// I C O N S  ////////////////////
  ///////////////////////////////////////
  
  //// Get Posts
  static async getIcons(term) {
    console.log('getting... '+term)
    const res = await axios.get(url+'icons/'+term)
    try {
      console.log('Success')
      console.log(res)
      return res
    } catch (err) {
      console.log('Error')
      return err
    }
  }
  ///////////////////////////////////////
  /////// B A D G E S  //////////////////
  ///////////////////////////////////////
  
  //// Update Log
  static saveBadge(load) {
    return axios.post(url+'savebadge/', {load})
  }
}


export default PostService