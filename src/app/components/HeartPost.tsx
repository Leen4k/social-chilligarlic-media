"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFillHeartFill } from 'react-icons/bs';

interface HeartProps {
  postId?: string;
  heart: any;
}

interface EmojiProps {
    name: string;
    image: string;
    alt: string;
}

interface SubmitHeartProps {
    postId: string;
    emojiName: string;
}

const emojiArray:EmojiProps[] = [
    {
      name: 'Sparkling Heart',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Sparkling%20Heart.webp',
      alt: 'Sparkling Heart',
    },
    {
      name: 'Crying Face',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Crying%20Face.webp',
      alt: 'Crying Face',
    },
    {
      name: 'Face Holding Back Tears',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Face%20Holding%20Back%20Tears.webp',
      alt: 'Face Holding Back Tears',
    },
    {
      name: 'See No Evil Monkey',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/See%20No%20Evil%20Monkey.webp',
      alt: 'See No Evil Monkey',
    },
    {
      name: 'Partying Face',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Partying%20Face.webp',
      alt: 'Partying Face',
    },
    {
      name: 'Grinning Squinting Face',
      image: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Grinning%20Squinting%20Face.webp',
      alt: 'Grinning Squinting Face',
    },
  ];
  

const HeartPost = ({ postId, heart }: HeartProps) => {
    console.log(heart)
  const session = useSession();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(
    async (data: SubmitHeartProps) => (axios.post("/api/posts/submitHeart", { data })),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["profile-post"]);
        queryClient.invalidateQueries(["detail-post"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

//   const submitHeart = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     mutate({ postId });
//   };
  const submitHeart = (emojiName:string) => {
    // toast.success();
    mutate({ postId, emojiName });
  };

//   const checkIfIncluded = () => {
//     return heart?.some((userHeart) => userHeart.userId === session?.data?.user?.id);
//   };
  const countEmoji = (emojiName: string) => {
    return heart?.filter((heartItem: any) => heartItem.emojiName === emojiName).length;
  };
  const checkIfIncluded = (emojiName: string) => {
    return heart?.some((heartItem: any) => heartItem.emojiName === emojiName && heartItem.userId === session?.data?.user?.id);
  };

  const heartRef = useRef<HTMLButtonElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  // Handle hover events
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const uniqueReactions = new Set(heart?.map((singleHeart:any) => singleHeart.emojiName));
  const getImageForReaction = (reactionName: string) => {
    switch (reactionName) {
      case 'Sparkling Heart':
        return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Symbols/Sparkling%20Heart.webp';
      case 'Crying Face':
        return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Crying%20Face.webp';
      case 'Face Holding Back Tears':
        return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Face%20Holding%20Back%20Tears.webp';
      case 'See No Evil Monkey':
        return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/See%20No%20Evil%20Monkey.webp';
      case 'Partying Face':
        return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Partying%20Face.webp';
      case 'Grinning Squinting Face':
        return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Grinning%20Squinting%20Face.webp';
      default:
        return '';
    }
  };

  return (
    <button
      ref={heartRef}
    //   onClick={submitHeart}
      disabled={isLoading}
      className={`
        disabled:cursor-not-allowed 
        hover:scale-105 
        disabled:opacity-50 
        flex gap-1 items-center pl-14
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* {heart?.length === 0 ? (
        <AiOutlineHeart />
      ) : (
        checkIfIncluded() ? (
          <BsFillHeartFill className={`${heart?.length > 0 ? 'text-red-500' : 'hidden'}`} />
        ) : (
          <AiOutlineHeart />
        )
      )} */}
      {heart?.length === 0 && <AiOutlineHeart />}
      {heart?.length}

    {Array.from(uniqueReactions).map((reactionName) => (
    <div key={reactionName} className="flex flex-col items-center">
       <img
            src={getImageForReaction(reactionName)}
            onClick={() => submitHeart(reactionName)}
            className={`cursor-pointer ${checkIfIncluded(reactionName) ? 'border-2' : ''}`}
            alt={reactionName}
            width="25"
            height="25"
        />
        {/* <h1 className="ml-1">{reactionName}</h1> */}
    </div>
    ))}

      {isHovered && (
        <div className="flex justify-start p-2 gap-2 items-center bg-white cursor-default border-b absolute w-44 overflow-x-scroll h-12 transition-all rounded-md">
          {emojiArray.map((emoji, index)=>(
            <div className="flex items-center justify-center">
                <img src={emoji.image} onClick={()=>{submitHeart(emoji.name)}} className={`cursor-pointer ${checkIfIncluded(emoji?.name) ? 'bg-slate-200 rounded-full scale-110' : ''}`} key={index} alt={emoji.alt} width="25" height="25" />
                <span className="absolute text-slate-500 top-7 text-sm">{countEmoji(emoji.name)}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
};

export default HeartPost;
