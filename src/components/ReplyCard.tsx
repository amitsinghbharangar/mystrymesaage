import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Reply } from "@/model/User";
import { formatDistanceToNow } from 'date-fns';

type ReplyCardProps = {
  message:Reply;
}

const ReplyCard = ({message}:ReplyCardProps) => {
  return (
    <Card>
        <CardHeader className="flex flex-row justify-between items-center  p-2">
          <div className="pl-5"><small>{formatDistanceToNow(new Date(message.createAt), { addSuffix: true })}</small></div>
            

        </CardHeader>
        <CardContent>
           <CardDescription className="text-base font-normal text-black">{message.content}</CardDescription>
        </CardContent>
        
    </Card>
  )
}

export default ReplyCard
