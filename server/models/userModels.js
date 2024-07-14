// models/userModel.js
const supabase = require('../config/supabaseClient');
class User {
  static async createUser(id, email, role) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id, email, role }]);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getUserById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

module.exports = User;
