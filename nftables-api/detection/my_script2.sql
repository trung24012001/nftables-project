select 
	r.id,
	src.host as ip_src, 
	dst.host as ip_dst, 
	psrc.port as port_src, 
	pdst.port as port_dst, 
	prot.protocol as protocol, 
	r.policy, 
	r.handle, 
	tables.family,
	tables.name as "table", 
	chains.name as chain, 
	chains.hook
from rules r
	join ip_src src on r.id = src.rule_id
	join ip_dst dst on r.id = dst.rule_id
	join port_src psrc on r.id = psrc.rule_id
	join port_dst pdst on r.id = pdst.rule_id 
	join protocols prot on r.id = prot.rule_id
	join chains on r.chain_id = chains.id
	join tables on chains.table_id = tables.id
where r.id = 375;
