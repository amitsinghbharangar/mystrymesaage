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
    <Card className="bg-blue-30">
        <CardHeader className="flex   p-2 justify-start bg-gray-200 rounded-lg">
          <div className="pl-5 justify-start"><small>{message.message}</small></div>
            
        </CardHeader>
        <CardContent className="flex justify-end pt-2">
           <CardDescription className="text-base font-normal text-black justify-end">{message.content}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end py-0">
          <div className="pl-5"><small className="text-gray-400">{formatDistanceToNow(new Date(message.createAt), { addSuffix: true })}</small></div>
        </CardFooter>
    </Card>
  )
}

export default ReplyCard
