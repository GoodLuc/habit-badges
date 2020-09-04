import axios from 'axios'
const url = 'http://localhost:5000/api/logs/'

class PostService {

  // Get Posts
  static async getPosts() {
      const res = await axios.get(url)
      try {
        const data = res.data
        return data.map(post => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
      } catch (err) {
        return err
      }
  }

  static async getMonth(user, year, month) {
    console.log('Getting..' + url + user + '/' + year + '/' + month)
    const res = await axios.get(url+user+'/'+year+'/'+month)
    try {
      const data = res.data
      console.log(data)
      return data.map(post => ({
        ...post
      }))
    } catch (err) {
      console.log('failed')
      return err
    }
  }
    
  // Create Posts
  static insertPost(text) {
    return axios.post(url, { text })
  }

  static updateLog(user, year, month, load) {
    return axios.post(url+'update/'+user+'/'+year+'/'+month, {load})
  }

  // Delete Posts
  static deletePost(id) {
    return axios.delete(`${url}${id}`)
  }

  // Create Posts
  static makeUser(user) {
    return axios.post(url+'makeuser', { user })
  }
}

export default PostService