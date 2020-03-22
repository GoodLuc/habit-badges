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

  static async getToday(user, month, day) {
    console.log('Getting..' + url + user + '/' + month + '/' + day)
    const res = await axios.get(url+user+'/'+month+'/'+day)
    try {
      const data = res.data
      //console.log(data)
      return data.map(post => ({
        ...post.days[day]
      }))
    } catch (err) {
      return err
    }
  }
    
  // Create Posts
  static insertPost(text) {
    return axios.post(url, { text })
  }

  static updateLog(user, load) {
    return axios.post(url+'update/'+user, {load})
  }

  // Delete Posts
  static deletePost(id) {
    return axios.delete(`${url}${id}`)
  }
}

export default PostService