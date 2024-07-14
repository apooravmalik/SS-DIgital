import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabaseUrl = "https://diwopcqhbzvlfzohokts.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key (first 5 chars):", supabaseKey.substring(0, 5));

export const supabase = createClient(supabaseUrl, supabaseKey);

export const createFormEntries = async (req, res) => {
  console.log('createFormEntries called');
  try {
    let { bankDetails } = req.body;

    if (!req.user || !req.user.id) {
      console.log('User not authenticated');
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!Array.isArray(bankDetails) || bankDetails.length === 0) {
      return res.status(400).json({ error: "Invalid bank details format" });
    }

    const { data: submissionData, error: submissionError } = await supabase
      .from("form_submissions")
      .insert({ user_id: req.user.id })
      .select();

    if (submissionError) {
      console.error("Supabase error (form_submissions):", submissionError);
      return res.status(400).json({
        error: "Error creating form submission",
        details: submissionError.message,
      });
    }

    const submissionId = submissionData[0].id;
    const magicLink = submissionData[0].magic_link;

    const formEntries = await Promise.all(bankDetails.map(async (detail) => {
      let scannerImageUrl = null;
      if (detail.scannerImage) {
        const base64Data = detail.scannerImage.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `${uuidv4()}.png`;
        const { error } = await supabase.storage
          .from('Image_Upload_SS')
          .upload(fileName, buffer, {
            contentType: 'image/png'
          });

        if (error) {
          console.error("Supabase storage error:", error);
          throw new Error("Error uploading image to storage");
        }

        const { data: urlData } = supabase.storage
          .from('Image_Upload_SS')
          .getPublicUrl(fileName);

        scannerImageUrl = urlData.publicUrl;
      }

      return {
        submission_id: submissionId,
        account_holder_name: detail.accountHolderName,
        bank_name: detail.bankName,
        account_number: detail.accountNumber,
        ifsc_code: detail.ifscCode,
        branch_address: detail.branchAddress,
        scanner_image_url: scannerImageUrl,
      };
    }));

    const { data, error } = await supabase.from("form_entries").insert(formEntries);

    if (error) {
      console.error("Supabase error (form_entries):", error);
      return res.status(400).json({
        error: "Error creating form entries",
        details: error.message,
      });
    }

    console.log('Form entries created successfully');
    res.status(201).json({
      message: "Form entries created successfully",
      data,
      magicLink: `${process.env.BASE_URL}/form-result/${magicLink}`
    });
  } catch (error) {
    console.error("Error creating form entries:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getFormEntriesByMagicLink = async (req, res) => {
  console.log('getFormEntriesByMagicLink called');
  try {
    const { magicLink } = req.params;
    console.log('Requested magic link:', magicLink);

    let submissionQuery;

    if (magicLink) {
      // Query for specific submission if magic link is provided
      submissionQuery = supabase
        .from("form_submissions")
        .select("id, magic_link, created_at")
        .eq("magic_link", magicLink)
        .single();
    } else {
      // Query for latest submission if no magic link is provided
      submissionQuery = supabase
        .from("form_submissions")
        .select("id, magic_link, created_at")
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    }

    const { data: submissionData, error: submissionError } = await submissionQuery;

    if (submissionError) {
      if (submissionError.code === 'PGRST116') {
        console.log('No form submission found');
        return res.status(404).json({
          error: "Form submission not found",
          details: magicLink ? "No matching submission for the provided magic link" : "No submissions found",
        });
      }
      console.error("Supabase error:", submissionError);
      return res.status(500).json({
        error: "Database error",
        details: submissionError.message,
        code: submissionError.code,
      });
    }

    // Fetch all associated entries for the submission
    const { data: entriesData, error: entriesError } = await supabase
      .from("form_entries")
      .select("*")
      .eq("submission_id", submissionData.id)
      .order('updated_at', { ascending: true });

    if (entriesError) {
      console.error("Supabase error:", entriesError);
      return res.status(500).json({
        error: "Database error",
        details: entriesError.message,
        code: entriesError.code,
      });
    }

    if (!entriesData || entriesData.length === 0) {
      console.log('No entries found for submission:', submissionData.id);
      return res.status(404).json({ error: "Form entries not found" });
    }

    console.log('Form entries found:', entriesData);
    res.status(200).json({
      data: entriesData,
      magicLink: submissionData.magic_link,
      submissionDate: submissionData.created_at
    });
  } catch (error) {
    console.error("Error retrieving form entries:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};