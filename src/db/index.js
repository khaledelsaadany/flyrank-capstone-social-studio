const crypto = require('crypto');
const { getDatabase } = require('./connection');
function generateId(){return crypto.randomUUID();}
const postsRepo={
 create({title,sourceUrl=null,rawContent,author=null},customDb){const db=customDb||getDatabase();const id=generateId();const createdAt=new Date().toISOString();db.prepare('INSERT INTO posts (id,title,source_url,raw_content,author,created_at) VALUES (?,?,?,?,?,?)').run(id,title,sourceUrl,rawContent,author,createdAt);return postsRepo.findById(id,db);},
 findById(id,customDb){const db=customDb||getDatabase();return db.prepare('SELECT * FROM posts WHERE id = ?').get(id)||null;},
 findAll(customDb){const db=customDb||getDatabase();return db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();}
};
const variantsRepo={
 create({postId,platform,content,hashtags=[],status='draft',versionLabel='A',groundingScore=1.0},customDb){const db=customDb||getDatabase();const id=generateId();const now=new Date().toISOString();db.prepare('INSERT INTO variants (id,post_id,platform,content,hashtags,status,version_label,grounding_score,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)').run(id,postId,platform.toLowerCase(),content,JSON.stringify(hashtags),status,versionLabel,groundingScore,now,now);return variantsRepo.findById(id,db);},
 findById(id,customDb){const db=customDb||getDatabase();const row=db.prepare('SELECT * FROM variants WHERE id = ?').get(id);if(!row)return null;return {...row,hashtags:JSON.parse(row.hashtags||'[]')};},
 findByPostId(postId,customDb){const db=customDb||getDatabase();return db.prepare('SELECT * FROM variants WHERE post_id = ? ORDER BY platform ASC, version_label ASC').all(postId).map(r=>({...r,hashtags:JSON.parse(r.hashtags||'[]')}));},
 updateStatus(id,newStatus,customDb){const db=customDb||getDatabase();db.prepare('UPDATE variants SET status=?,updated_at=? WHERE id=?').run(newStatus,new Date().toISOString(),id);return variantsRepo.findById(id,db);},
 updateContent(id,{content,hashtags},customDb){const db=customDb||getDatabase();db.prepare('UPDATE variants SET content=?,hashtags=?,updated_at=? WHERE id=?').run(content,JSON.stringify(hashtags||[]),new Date().toISOString(),id);return variantsRepo.findById(id,db);},
 setWinner(id,customDb){const db=customDb||getDatabase();const variant=variantsRepo.findById(id,db);if(!variant)return null;db.transaction(()=>{db.prepare('UPDATE variants SET is_winner=0 WHERE post_id=? AND platform=?').run(variant.post_id,variant.platform);db.prepare("UPDATE variants SET is_winner=1,status='approved',updated_at=? WHERE id=?").run(new Date().toISOString(),id);})();return variantsRepo.findById(id,db);}
};
const slotsRepo={
 create({variantId,platform,scheduledTime},customDb){const db=customDb||getDatabase();const id=generateId();db.prepare("INSERT INTO schedule_slots (id,variant_id,platform,scheduled_time,status,created_at) VALUES (?,?,?,?, 'pending',?)").run(id,variantId,platform.toLowerCase(),scheduledTime,new Date().toISOString());return slotsRepo.findById(id,db);},
 findById(id,customDb){const db=customDb||getDatabase();return db.prepare('SELECT * FROM schedule_slots WHERE id=?').get(id)||null;},
 findAll(customDb){const db=customDb||getDatabase();return db.prepare('SELECT s.*,v.content as variant_content,v.status as variant_status,v.platform as variant_platform FROM schedule_slots s LEFT JOIN variants v ON s.variant_id=v.id ORDER BY s.scheduled_time ASC').all();},
 findDueSlots(beforeTimeIso,customDb){const db=customDb||getDatabase();return db.prepare("SELECT * FROM schedule_slots WHERE status='pending' AND scheduled_time<=? ORDER BY scheduled_time ASC").all(beforeTimeIso);},
 updateStatus(id,newStatus,customDb){const db=customDb||getDatabase();db.prepare('UPDATE schedule_slots SET status=? WHERE id=?').run(newStatus,id);return slotsRepo.findById(id,db);}
};
const historyRepo={
 recordAttempt({slotId,variantId,idempotencyKey,adapterName,status,externalPostId,externalUrl=null,payloadPreview='',errorMessage=null},customDb){const db=customDb||getDatabase();const id=generateId();db.prepare('INSERT INTO publish_history (id,slot_id,variant_id,idempotency_key,adapter_name,status,external_post_id,external_url,payload_preview,error_message,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(id,slotId,variantId,idempotencyKey,adapterName,status,externalPostId,externalUrl,payloadPreview,errorMessage,new Date().toISOString());return historyRepo.findByIdempotencyKey(idempotencyKey,db);},
 findByIdempotencyKey(idempotencyKey,customDb){const db=customDb||getDatabase();return db.prepare('SELECT * FROM publish_history WHERE idempotency_key=?').get(idempotencyKey)||null;},
 findBySlotId(slotId,customDb){const db=customDb||getDatabase();return db.prepare('SELECT * FROM publish_history WHERE slot_id=? ORDER BY published_at DESC').all(slotId);},
 findAll(customDb){const db=customDb||getDatabase();return db.prepare('SELECT h.*,v.platform,s.scheduled_time FROM publish_history h LEFT JOIN variants v ON h.variant_id=v.id LEFT JOIN schedule_slots s ON h.slot_id=s.id ORDER BY h.published_at DESC').all();}
};
module.exports={generateId,postsRepo,variantsRepo,slotsRepo,historyRepo};
