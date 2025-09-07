import Card from "@mui/material/Card";
import {
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

function BookDetails() {
  const location = useLocation();
  console.log(location.state);
  const bookData = location.state || {
    title: "Default Title",
    author: "Default Author",
    coverUrl: "/src/assets/images/Book_Banner.png",
    isAvailable: false,
    rating: 0,
  };
  return (
    <Card sx={{}}>
      <CardMedia
        sx={{ height: 140 }}
        image= {bookData.coverUrl} className="blur-2xl border-2 border-br-gray-light"
        title={bookData.title}
      />
      <CardContent> 
        <div className="grid auto-cols-max grid-flow-col gap-4 px-15 py-5">
          <div className= "  flex w-34">
            <div className="w-32 h-50">
              {bookData.coverUrl && (
              <img
                src={bookData.coverUrl}
                alt={bookData.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          </div>
          <div className="flex flex-col col-span-2">

          <Typography gutterBottom variant="h5" component="div">
            {bookData.title}
          </Typography>
          

          <Typography variant="body2" color="text.secondary">
            Author: {bookData.author}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Rating: {bookData.rating}/5
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Status:{" "}
            {bookData.isAvailable
              ? "Available for borrowing"
              : "Currently unavailable"}
          </Typography>
          
        </div>
        </div>
        
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default BookDetails;
