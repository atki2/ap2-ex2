import React, { useState } from 'react';
import empty from './pictures/empty.png'


function ImageUploader() {
  const [imageUrl, setImageUrl] = useState(empty);

  function handleImageChange(event) {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      setImageUrl(event.target.result);
    };

    reader.readAsDataURL(selectedFile);
  }
  return (
    <div>
            <div className="form-group">
        <label htmlFor="custom-file" className="form-lable">
          Profile picture
        </label>
<input type="file" className="form-control" id="picture" name="file" onChange={handleImageChange} required/>
     </div>
      {imageUrl && (
        <img src={imageUrl} alt="profile picture" id="profilePic" />
        )}
    </div>
  );
}

export default ImageUploader;