import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogContent,
  Slider,
  Button,
} from "@mui/material";
import {
  Edit,
  Delete,
  Search,
  ZoomIn,
  ZoomOut,
  Brightness4,
  Contrast,
  ColorLens,
  BlurOn,
  Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";

const PhotoGrid = ({ photos, onEditPhoto, onDeletePhoto }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const filtered =
      photos?.filter(
        (photo) =>
          photo.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          photo.student_name.includes(searchTerm)
      ) || [];
    setFilteredPhotos(filtered);
  }, [searchTerm, photos]);

  const handlePhotoAction = (action, photo) => {
    try {
      if (action === "edit") {
        onEditPhoto(photo);
      } else if (action === "delete") {
        onDeletePhoto(photo);
      } else if (action === "preview") {
        setSelectedPhoto(photo);
        setPreviewOpen(true);
        setZoom(100);
        setFilters({
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
        });
      }
    } catch (error) {
      dispatch(
        showMessage({
          message: `Failed to ${action} photo: ${error.message}`,
          variant: "error",
        })
      );
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        blur(${filters.blur}px)
      `,
      transform: `scale(${zoom / 100})`,
    };
  };

  return (
    <Box
      sx={{ p: 2 }}
      style={{
        overflow: "hidden",
      }}
    >
      {/* <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or student number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </Box> */}

      <Grid container spacing={2}>
        {filteredPhotos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ position: "relative", height: "100%" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.image}
                  alt={photo.student_name}
                  onClick={() => handlePhotoAction("preview", photo)}
                  sx={{
                    objectFit: "cover",
                    "&:hover": {
                      cursor: "pointer",
                      opacity: 0.8,
                    },
                  }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {photo.student_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Student No: {photo.stdno}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {photo.last_modified_on ? convertTimestampToDate(parseInt(photo.last_modified_on)): ""}
                  </Typography>
                  <Box
                    sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handlePhotoAction("edit", photo)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handlePhotoAction("delete", photo)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden", p: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <Box sx={{ fontWeight: 600 }}>Image Preview</Box>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <DialogContent sx={{ backgroundColor: "#fafafa", px: 3, py: 2 }}>
          {/* Controls stay fixed */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mb: 2, zIndex: 2 }}
          >
            <Box
              sx={{
                background: "#fff",
                px: 2,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                gap: 1,
                alignItems: "center",
                position: "sticky",
                top: 0,
              }}
            >
              <IconButton
                onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
              >
                <ZoomOut />
              </IconButton>
              <Box sx={{ fontSize: 14, minWidth: 40, textAlign: "center" }}>
                {zoom}%
              </Box>
              <IconButton
                onClick={() => setZoom((prev) => Math.min(200, prev + 10))}
              >
                <ZoomIn />
              </IconButton>
            </Box>
          </Box>

          {selectedPhoto && (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                overflow: "auto",
                maxHeight: "70vh",
                borderRadius: 2,
                p: 1,
              }}
            >
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.student_name}
                style={{
                  transform: `scale(${zoom / 100})`,
                  transition: "transform 0.3s ease",
                  transformOrigin: "center",
                  borderRadius: 8,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  ...getFilterStyle(),
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PhotoGrid;
