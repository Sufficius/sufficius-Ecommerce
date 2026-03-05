// // src/modules/landing/components/TestimonialAvatar.tsx

// import { SupabaseImage } from "@/components/ui/supabaseImage";

// export const TestimonialAvatar = ({ id }: { id: number }) => {
//   return (
//     <div className="h-10 w-10 rounded-full overflow-hidden">
//       <SupabaseImage
//         src={`avatars/client-${id}.jpg`} // Caminho relativo
//         alt={`Cliente ${id}`}
//         bucket="product"
//         width={40}
//         height={40}
//         className="w-full h-full"
//       />
//     </div>
//   );
// };